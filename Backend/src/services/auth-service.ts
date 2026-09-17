import prisma from "../infrastructure/prisma";
import { Util } from "../common/utils";
import { BadRequestException } from "../infrastructure/http-exceptions";

export class AuthService {
  private static createSession(user: { id: string; email: string; name: string | null; username: string | null; avatarUrl: string | null; role: string }) {
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    return {
      accessToken: Util.generateToken(tokenPayload, "1d"),
      refreshToken: Util.generateRefreshToken(tokenPayload),
      user: { id: user.id, email: user.email, name: user.name, username: user.username, avatarUrl: user.avatarUrl, role: user.role },
    };
  }

  static async loginWithOAuth(profile: { email: string; provider: string; providerId: string; name?: string; avatarUrl?: string }) {
    const email = profile.email.toLowerCase();
    const identity = await prisma.oAuthIdentity.findUnique({
      where: { provider_providerId: { provider: profile.provider, providerId: profile.providerId } },
      include: { user: true },
    });
    let user = identity?.user || await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          role: "USER",
          oauthIdentities: { create: { provider: profile.provider, providerId: profile.providerId } },
        },
      });
    } else if (!identity) {
      await prisma.oAuthIdentity.create({ data: { userId: user.id, provider: profile.provider, providerId: profile.providerId } });
    }
    return this.createSession(user);
  }

  static async register(payload: { email: string; password: string; name?: string }) {
    const { email, password, name } = payload;
    if (!email || !password) throw new BadRequestException("Email and password are required");

    const normalizedEmail = email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      throw new BadRequestException("Email is already registered");
    }

    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: Util.hashPassword(password), name, role: "USER" },
    });
    return this.createSession(user);
  }

  static async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    if (!email || !password) throw new BadRequestException("Email and password are required");

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user?.password || !Util.comparePassword(password, user.password)) {
      throw new BadRequestException("Invalid email or password");
    }
    return this.createSession(user);
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, username: true, bio: true, avatarUrl: true,
        emailNotifications: true, mentionNotifications: true, role: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) throw new BadRequestException("User profile not found");
    return user;
  }
}

export default AuthService;
