import prisma from "../infrastructure/prisma";
import { BadRequestException, ForbiddenException, NotFoundException } from "../infrastructure/http-exceptions";
import { Util } from "../common/utils";

export class DocumentService {
    static async getWorkspaceDocuments(workspaceId: string, userId: string, options: { isArchived?: boolean } = {}) {
        const { isArchived = false } = options;

        const isMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });

        if (!isMember) {
            throw new ForbiddenException("You do not have access to this workspace's documents");
        }

        return prisma.document.findMany({
            where: {
                workspaceId,
                isArchived,
            },
            select: {
                id: true,
                title: true,
                icon: true,
                description: true,
                pageCount: true,
                status: true,
                sortOrder: true,
                plainText: true,
                isArchived: true,
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
            orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        });
    }

    static async getDocumentById(id: string, userId: string) {
        const document = await prisma.document.findFirst({
            where: {
                id,
                workspace: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                }
            },
        });

        if (!document) {
            throw new NotFoundException("Document not found");
        }

        return document;
    }

    static async createDocument(workspaceId: string,
        authorId: string,
        data: {
            title?: string;
            icon?: string;
            plainText?: string;
            description?: string;
            pageCount?: number;
            status?: string;
            sortOrder?: number;
        }
    ) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        const isMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: authorId,
                }
            }
        });
        if (!isMember) {
            throw new ForbiddenException("You do not have permission to create documents in this workspace");
        }

        const slug = Util.generateSlug(data.title || "Untitled");
        const sortOrder = await prisma.document.count({ where: { workspaceId } });

        return prisma.document.create({
            data: {
                workspaceId,
                authorId,
                slug,
                title: data.title?.trim() || "Untitled",
                icon: data.icon,
                plainText: data.plainText,
                description: data.description,
                pageCount: data.pageCount,
                status: data.status,
                sortOrder: data.sortOrder ?? sortOrder,
            },
            select: {
                id: true,
                workspaceId: true,
                authorId: true,
                title: true,
                icon: true,
                description: true,
                pageCount: true,
                status: true,
                sortOrder: true,
                slug: true,
                isArchived: true,
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
        userId: string,
        data: {
            title?: string;
            icon?: string;
            plainText?: string;
            isArchived?: boolean;
            description?: string | null;
            pageCount?: number;
            status?: string;
            sortOrder?: number;
        }
    ) {
        const document = await this.getDocumentById(id, userId);

        var newSlug;
        if (data.title) newSlug = Util.generateSlug(data.title);

        if (newSlug) {
            const existingDocument = await prisma.document.findFirst({
                where: {
                    workspaceId: document.workspaceId,
                    slug: newSlug,
                    id: { not: id }
                }
            });

            if (existingDocument) {
                throw new BadRequestException("Document with this title already exists in this workspace");
            }
        }

        return prisma.document.update({
            where: { id },
            data: {
                title: data.title !== undefined ? data.title : undefined,
                slug: newSlug !== undefined ? newSlug : undefined,
                icon: data.icon !== undefined ? data.icon : undefined,
                plainText: data.plainText !== undefined ? data.plainText : undefined,
                description: data.description !== undefined ? data.description : undefined,
                pageCount: data.pageCount !== undefined ? data.pageCount : undefined,
                status: data.status !== undefined ? data.status : undefined,
                sortOrder: data.sortOrder !== undefined ? data.sortOrder : undefined,
                isArchived: data.isArchived !== undefined ? data.isArchived : undefined
            }
        });
    }

    // Soft delete
    static async setArchiveStatus(id: string, userId: string, isArchived: boolean) {
        await this.getDocumentById(id, userId);
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
    static async deleteDocument(id: string, userId: string) {
        await this.getDocumentById(id, userId);
        return prisma.document.delete({
            where: { id },
        });
    }
}

export default DocumentService;
