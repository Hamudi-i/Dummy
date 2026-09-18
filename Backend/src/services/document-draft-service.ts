import prisma from "../infrastructure/prisma";
import { ForbiddenException, NotFoundException } from "../infrastructure/http-exceptions";

export class DocumentDraftService {
  private static async assertAccess(documentId: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: { id: documentId, workspace: { members: { some: { userId } } } },
      select: { id: true },
    });
    if (!document) throw new ForbiddenException("You do not have access to this document");
  }

  static async get(documentId: string, userId: string) {
    await this.assertAccess(documentId, userId);
    return prisma.documentDraft.findUnique({ where: { documentId } });
  }

  static async save(documentId: string, userId: string, content: string, isUnsaved = true) {
    await this.assertAccess(documentId, userId);
    return prisma.documentDraft.upsert({
      where: { documentId },
      create: { documentId, content, isUnsaved },
      update: { content, isUnsaved },
    });
  }

  static async remove(documentId: string, userId: string) {
    await this.assertAccess(documentId, userId);
    const draft = await prisma.documentDraft.findUnique({ where: { documentId } });
    if (!draft) throw new NotFoundException("Draft not found");
    return prisma.documentDraft.delete({ where: { documentId } });
  }
}
