import prisma from "../infrastructure/prisma";
import { BadRequestException } from "../infrastructure/http-exceptions";

export class SupportRequestService {
  static async create(userId: string | undefined, data: { email?: string; subject?: string; message: string }) {
    if (!data.message?.trim()) throw new BadRequestException("A support message is required");
    return prisma.supportRequest.create({ data: { userId, email: data.email, subject: data.subject, message: data.message.trim() } });
  }
}
