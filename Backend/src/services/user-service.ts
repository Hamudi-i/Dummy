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

  static async updateUser(id: string, data: { name?: string; role?: string; password?: string }) {
    await this.getUserById(id);

    const updateData: { name?: string; role?: string; password?: string } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.password) updateData.password = Util.hashPassword(data.password);

    return prisma.user.update({
      where: { id },
      data: updateData,
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

  static async deleteUser(id: string) {
    await this.getUserById(id);
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default UserService;
