import prisma from "../infrastructure/prisma";
import { NotFoundException, BadRequestException } from "../infrastructure/http-exceptions";

export class DocumentSnapshotService {
    // 1. Get version history timeline (exclude heavy binary blob for fast loading)
    static async getDocumentSnapshots(documentId: string) {
        return prisma.documentSnapshot.findMany({
            where: { documentId },
            select: {
                id: true,
                documentId: true,
                summary: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    static async createDocumentSnapshot(documentId: string, createdById: string, summary: string) {
        const document = prisma.document.findUnique({
            where: { id: documentId }
        });

        if (!document) {
            throw new NotFoundException("Dcoument not found");
        }

    }
}