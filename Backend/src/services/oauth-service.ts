import crypto from "crypto";
const jwt = require("jsonwebtoken");
import { BadRequestException } from "../infrastructure/http-exceptions";

export type OAuthProvider = "google" | "github" | "apple";

type OAuthProfile = { email: string; providerId: string; name?: string; avatarUrl?: string };

const backendUrl = () => process.env.BACKEND_URL || "http://localhost:5000";
const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:3000";
const callbackUrl = (provider: OAuthProvider) => `${backendUrl()}/api/auth/oauth/${provider}/callback`;
const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new BadRequestException(`${name} is not configured`);
  return value;
};

export class OAuthService {
  static frontendUrl() {
    return frontendUrl();
  }

  static backendUrl() {
    return backendUrl();
  }

  static provider(value: string): OAuthProvider {
    if (value === "google" || value === "github" || value === "apple") return value;
    throw new BadRequestException("Unsupported OAuth provider");
  }

  static authorizationUrl(provider: OAuthProvider) {
    const state = jwt.sign({ provider }, required("JWT_SECRET"), { expiresIn: "10m" });
    const redirectUri = callbackUrl(provider);
    if (provider === "google") {
      return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ client_id: required("GOOGLE_CLIENT_ID"), redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", state })}`;
    }
    if (provider === "github") {
      return `https://github.com/login/oauth/authorize?${new URLSearchParams({ client_id: required("GITHUB_CLIENT_ID"), redirect_uri: redirectUri, scope: "read:user user:email", state })}`;
    }
    return `https://appleid.apple.com/auth/authorize?${new URLSearchParams({ client_id: required("APPLE_CLIENT_ID"), redirect_uri: redirectUri, response_type: "code", response_mode: "form_post", scope: "name email", state })}`;
  }

  static verifyState(provider: OAuthProvider, state?: string) {
    if (!state) throw new BadRequestException("Missing OAuth state");
    try {
      const payload = jwt.verify(state, required("JWT_SECRET")) as { provider?: string };
      if (payload.provider !== provider) throw new Error("Provider mismatch");
    } catch {
      throw new BadRequestException("OAuth session expired or is invalid");
    }
  }

  static async profile(provider: OAuthProvider, code?: string): Promise<OAuthProfile> {
    if (!code) throw new BadRequestException("Missing OAuth authorization code");
    if (provider === "google") return this.googleProfile(code);
    if (provider === "github") return this.githubProfile(code);
    return this.appleProfile(code);
  }

  private static async googleProfile(code: string): Promise<OAuthProfile> {
    const token = await this.form("https://oauth2.googleapis.com/token", { code, client_id: required("GOOGLE_CLIENT_ID"), client_secret: required("GOOGLE_CLIENT_SECRET"), redirect_uri: callbackUrl("google"), grant_type: "authorization_code" });
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } });
    const user = await response.json();
    if (!response.ok || !user.email_verified) throw new BadRequestException("Google did not return a verified email address");
    return { email: user.email, providerId: user.sub, name: user.name, avatarUrl: user.picture };
  }

  private static async githubProfile(code: string): Promise<OAuthProfile> {
    const token = await this.form("https://github.com/login/oauth/access_token", { code, client_id: required("GITHUB_CLIENT_ID"), client_secret: required("GITHUB_CLIENT_SECRET"), redirect_uri: callbackUrl("github") });
    const headers = { Authorization: `Bearer ${token.access_token}`, Accept: "application/vnd.github+json", "User-Agent": "co-lab" };
    const response = await fetch("https://api.github.com/user", { headers });
    const user = await response.json();
    let email = user.email;
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", { headers });
      const emails = await emailsResponse.json();
      email = emails.find((item: any) => item.primary && item.verified)?.email || emails.find((item: any) => item.verified)?.email;
    }
    if (!response.ok || !email) throw new BadRequestException("GitHub did not provide a verified email address");
    return { email, providerId: String(user.id), name: user.name || user.login, avatarUrl: user.avatar_url };
  }

  private static async appleProfile(code: string): Promise<OAuthProfile> {
    const token = await this.form("https://appleid.apple.com/auth/token", { code, client_id: required("APPLE_CLIENT_ID"), client_secret: this.appleClientSecret(), redirect_uri: callbackUrl("apple"), grant_type: "authorization_code" });
    const claims = await this.verifyAppleToken(token.id_token);
    if (!claims.email || !claims.email_verified) throw new BadRequestException("Apple did not return a verified email address");
    return { email: claims.email, providerId: claims.sub };
  }

  private static appleClientSecret() {
    return jwt.sign({}, required("APPLE_PRIVATE_KEY").replace(/\\n/g, "\n"), { algorithm: "ES256", issuer: required("APPLE_TEAM_ID"), subject: required("APPLE_CLIENT_ID"), audience: "https://appleid.apple.com", expiresIn: "180d", keyid: required("APPLE_KEY_ID") });
  }

  private static async verifyAppleToken(idToken?: string): Promise<any> {
    if (!idToken) throw new BadRequestException("Apple did not return an ID token");
    const [encodedHeader, encodedClaims, encodedSignature] = idToken.split(".");
    if (!encodedHeader || !encodedClaims || !encodedSignature) throw new BadRequestException("Invalid Apple ID token");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString());
    if (header.alg !== "RS256") throw new BadRequestException("Unsupported Apple token algorithm");
    const keysResponse = await fetch("https://appleid.apple.com/auth/keys");
    const keys = await keysResponse.json();
    const key = keys.keys?.find((item: any) => item.kid === header.kid);
    if (!key || !crypto.verify("RSA-SHA256", Buffer.from(`${encodedHeader}.${encodedClaims}`), crypto.createPublicKey({ key, format: "jwk" }), Buffer.from(encodedSignature, "base64url"))) throw new BadRequestException("Apple ID token signature is invalid");
    const claims = JSON.parse(Buffer.from(encodedClaims, "base64url").toString());
    if (claims.iss !== "https://appleid.apple.com" || claims.aud !== required("APPLE_CLIENT_ID") || claims.exp * 1000 < Date.now()) throw new BadRequestException("Apple ID token claims are invalid");
    return claims;
  }

  private static async form(url: string, values: Record<string, string>) {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: new URLSearchParams(values) });
    const body = await response.json();
    if (!response.ok || !body.access_token) throw new BadRequestException(body.error_description || "OAuth token exchange failed");
    return body;
  }

  static redirectWithSession(session: { accessToken: string; refreshToken: string; user: unknown }) {
    const params = new URLSearchParams({ accessToken: session.accessToken, refreshToken: session.refreshToken, user: JSON.stringify(session.user) });
    return `${this.frontendUrl()}/auth/callback?${params}#${params}`;
  }
}
