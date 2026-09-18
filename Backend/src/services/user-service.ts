import prisma from "../infrastructure/prisma";
import { Util } from "../common/utils";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        emailNotifications: true,
        mentionNotifications: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        emailNotifications: true,
        mentionNotifications: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        emailNotifications: true,
        mentionNotifications: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  static async createUser(data: { email: string; name?: string; password?: string; role?: string }) {
    if (!data.email) {
      throw new BadRequestException("Email is required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const hashedPassword = data.password ? Util.hashPassword(data.password) : undefined;

    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        password: hashedPassword,
        role: data.role || "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async updateUser(id: string, data: { email?: string; name?: string; username?: string | null; bio?: string | null; avatarUrl?: string | null; emailNotifications?: boolean; mentionNotifications?: boolean; role?: string; password?: string }) {
    await this.getUserById(id);

    const updateData: { email?: string; name?: string; username?: string | null; bio?: string | null; avatarUrl?: string | null; emailNotifications?: boolean; mentionNotifications?: boolean; role?: string; password?: string } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase().trim();
    if (data.username !== undefined) updateData.username = data.username?.trim() || null;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.emailNotifications !== undefined) updateData.emailNotifications = data.emailNotifications;
    if (data.mentionNotifications !== undefined) updateData.mentionNotifications = data.mentionNotifications;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.password) updateData.password = Util.hashPassword(data.password);

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        emailNotifications: true,
        mentionNotifications: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async changePassword(id: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) throw new BadRequestException("Current and new passwords are required");
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user?.password || !Util.comparePassword(currentPassword, user.password)) {
      throw new BadRequestException("Current password is incorrect");
    }
    await prisma.user.update({ where: { id }, data: { password: Util.hashPassword(newPassword) } });
  }

  static async deleteUser(id: string) {
    await this.getUserById(id);
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default UserService;
