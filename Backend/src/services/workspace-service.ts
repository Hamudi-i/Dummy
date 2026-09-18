import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import { Util } from "../common/utils";

export class WorkspaceService {
    static async getAllWorkspaces(userId: string) {
        return prisma.workspace.findMany({
            where: {
                isArchived: false,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true, icon: true, color: true, badgeLabel: true, badgeStyle: true, previewGradient: true, rotation: true, isArchived: true, archivedAt: true, sortOrder: true,
                createdAt: true,
                updatedAt: true,
                members: true,
                documents: true,
                invites: true
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
    }

    static async getWorkspaceById(id: string, userId: string) {
        const workspace = await prisma.workspace.findFirst({
            where: {
                id,
                isArchived: false,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true, icon: true, color: true, badgeLabel: true, badgeStyle: true, previewGradient: true, rotation: true, isArchived: true, archivedAt: true, sortOrder: true,
                createdAt: true,
                updatedAt: true,
                members: true,
                documents: true,
                invites: true
            },
        });

        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        return workspace;
    }

    static async getWorkspaceBySlug(slug: string, userId: string) {
        if (!slug) {
            throw new BadRequestException("Slug is required");
        }
        const workspace = await prisma.workspace.findFirst({
            where: {
                slug,
                isArchived: false,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true, icon: true, color: true, badgeLabel: true, badgeStyle: true, previewGradient: true, rotation: true, isArchived: true, archivedAt: true, sortOrder: true,
                createdAt: true,
                updatedAt: true,
                members: true,
                documents: true,
                invites: true
            },
        });

        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        return workspace;
    }

    static async createWorkspace(data: { name: string; description?: string; icon?: string; color?: string; badgeLabel?: string; badgeStyle?: string; previewGradient?: string; rotation?: string }, userId: string) {
        if (!data.name) {
            throw new BadRequestException("Name is required");
        }

        const slug = Util.generateSlug(data.name);
        const sortOrder = await prisma.workspace.count({ where: { members: { some: { userId } } } });

        const existingWorkspace = await prisma.workspace.findUnique({
            where: { slug },
        });

        if (existingWorkspace) {
            throw new BadRequestException("Workspace with this name already exists");
        }

        return prisma.workspace.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                icon: data.icon,
                color: data.color,
                badgeLabel: data.badgeLabel,
                badgeStyle: data.badgeStyle,
                previewGradient: data.previewGradient,
                rotation: data.rotation,
                sortOrder,
                members: {
                    create: {
                        role: "OWNER",
                        userId
                    }
                },
            },
            select: {
                id: true, name: true, slug: true, description: true, icon: true, color: true, badgeLabel: true, badgeStyle: true, previewGradient: true, rotation: true, isArchived: true, archivedAt: true, sortOrder: true
            }
        });
    }

    static async updateWorkspace(id: string, userId: string, data: { name?: string; description?: string | null; icon?: string | null; color?: string | null; badgeLabel?: string | null; badgeStyle?: string | null; previewGradient?: string | null; rotation?: string | null; sortOrder?: number; }) {
        await this.getWorkspaceById(id, userId);

        var newSlug;
        if (data.name) {
            newSlug = Util.generateSlug(data.name);
        }

        if (newSlug) {
            const existingWorkspace = await prisma.workspace.findUnique({ where: { slug: newSlug } });
            if (existingWorkspace) throw new BadRequestException("Workspace with this slug already exists");
        }

        const updateData: { name?: string; slug?: string; description?: string | null; icon?: string | null; color?: string | null; badgeLabel?: string | null; badgeStyle?: string | null; previewGradient?: string | null; rotation?: string | null; sortOrder?: number; } = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (newSlug) updateData.slug = newSlug;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.icon !== undefined) updateData.icon = data.icon;
        if (data.color !== undefined) updateData.color = data.color;
        if (data.badgeLabel !== undefined) updateData.badgeLabel = data.badgeLabel;
        if (data.badgeStyle !== undefined) updateData.badgeStyle = data.badgeStyle;
        if (data.previewGradient !== undefined) updateData.previewGradient = data.previewGradient;
        if (data.rotation !== undefined) updateData.rotation = data.rotation;
        if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

        return prisma.workspace.update({
            where: { id },
            data: updateData,
            select: {
                id: true, name: true, slug: true, description: true, icon: true, color: true, badgeLabel: true, badgeStyle: true, previewGradient: true, rotation: true, isArchived: true, archivedAt: true, sortOrder: true
            }
        });
    }

    static async deleteWorkspace(id: string, userId: string) {
        await this.getWorkspaceById(id, userId);
        return prisma.workspace.delete({
            where: { id },
        });
    }

    static async getArchivedWorkspaces(userId: string) {
        return prisma.workspace.findMany({
            where: { isArchived: true, members: { some: { userId } } },
            orderBy: { archivedAt: "desc" },
        });
    }

    static async setArchiveStatus(id: string, userId: string, isArchived: boolean) {
        const workspace = await prisma.workspace.findFirst({ where: { id, members: { some: { userId } } }, select: { id: true } });
        if (!workspace) throw new NotFoundException("Workspace not found");
        return prisma.workspace.update({ where: { id }, data: { isArchived, archivedAt: isArchived ? new Date() : null } });
    }
}

export default WorkspaceService;
