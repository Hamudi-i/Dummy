import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";

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

    static async createDocument(workspaceId: string,
        authorId: string,
        data: {
            title?: string;
            icon?: string;
            plainText?: string;
        }
    ) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        return prisma.document.create({
            data: {
                workspaceId,
                authorId,
                title: data.title?.trim() || "Untitled",
                icon: data.icon,
                plainText: data.plainText,
            },
            select: {
                id: true,
                workspaceId: true,
                authorId: true,
                title: true,
                icon: true,
                isArchived: true,
                isPublic: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            }
        });
    }

    // Update document metadata
    static async updateDocument(
        id: string,
        data: {
            title?: string;
            icon?: string;
            plainText?: string;
            isArchived?: boolean;
        }
    ) {
        await this.getDocumentById(id);

        return prisma.document.update({
            where: { id },
            data: {
                title: data.title !== undefined ? data.title : undefined,
                icon: data.icon !== undefined ? data.icon : undefined,
                plainText: data.plainText !== undefined ? data.plainText : undefined,
                isArchived: data.isArchived !== undefined ? data.isArchived : undefined
            }
        });
    }

    // Soft delete
    static async setArchiveStatus(id: string, isArchived: boolean) {
        await this.getDocumentById(id);
        return prisma.document.update({
            where: { id },
            data: { isArchived },
            select: {
                id: true,
                title: true,
                isArchived: true
            }
        });
    }

    // Hard/permanent delete
    static async deleteDocument(id: string) {
        await this.getDocumentById(id);
        return prisma.document.delete({
            where: { id },
        });
    }
}

export default DocumentService;