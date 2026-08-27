import prisma from "../infrastructure/prisma";
import { Util } from "../common/utils";
import { BadRequestException } from "../infrastructure/http-exceptions";

export class AuthService {
  static async register(payload: { email: string; password: string; name?: string }) {
    const { email, password, name } = payload;
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException("Email is already registered");
    }

    const hashedPassword = Util.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: "USER",
      },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = Util.generateToken(tokenPayload, "1d");
    const refreshToken = Util.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new BadRequestException("Invalid email or password");
    }

    const isValidPassword = Util.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException("Invalid email or password");
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = Util.generateToken(tokenPayload, "1d");
    const refreshToken = Util.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User profile not found");
    }

    return user;
  }
}

export default AuthService;
