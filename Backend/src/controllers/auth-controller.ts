import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";
import { OAuthService } from "../services/oauth-service";

export class AuthController {
  static async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async loginWithEmailAndPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getAuthenticatedUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = (req as any).currentUser;
      const profile = await AuthService.getProfile(currentUser.userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async redirectToOAuthProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.redirect(OAuthService.authorizationUrl(OAuthService.provider(req.params.provider as string))); }
    catch (error) { next(error); }
  }

  static async completeOAuthSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = OAuthService.provider(req.params.provider as string);
      OAuthService.verifyState(provider, String(req.query.state || req.body?.state || ""));
      const profile = await OAuthService.profile(provider, String(req.query.code || req.body?.code || ""));
      res.redirect(OAuthService.redirectWithSession(await AuthService.loginWithOAuth({ ...profile, provider })));
    } catch (error) { next(error); }
  }
}

export default AuthController;
