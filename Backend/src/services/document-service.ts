import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import { DocumentRole } from "../../generated/prisma/enums";

class DocumentService {
    static async getWorkspaceDocuments(workspaceId: string, options: { isArchived?: boolean } = {}) {
        const { isArchived = false } = options;
        return prisma.document.findMany({
            where: {
                workspaceId,
                isArchived,
            },
            select: {
                id: true,
                title: true,
                icon: true,
                isArchived: true,
                isPublic: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    static async getDocumentById(id: string) {
        const document = await prisma.document.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                children: {
                    where: { isArchived: false },
                    select: {
                        id: true,
                        title: true,
                        icon: true,
                    },
                },
            },

        });

        if (!document) {
            throw new NotFoundException("Document not found");
        }
    }
}