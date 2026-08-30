import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import { Util } from "../common/utils";

export class WorkspaceService {
    static async getAllWorkspaces() {
        return prisma.workspace.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                members: true,
                documents: true,
                invites: true
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getWorkspaceById(id: string) {
        const workspace = await prisma.workspace.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
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

    static async getWorkspaceBySlug(slug: string) {
        if (!slug) {
            throw new BadRequestException("Slug is required");
        }
        const workspace = await prisma.workspace.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
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

    static async createWorkspace(data: { name: string }, userId: string) {
        if (!data.name) {
            throw new BadRequestException("Name is required");
        }

        const slug = Util.generateSlug(data.name);

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
                members: {
                    create: {
                        role: "OWNER",
                        userId
                    }
                },
            },
            select: {
                id: true,
                name: true,
                slug: true
            }
        });
    }

    static async updateWorkspace(id: string, data: { name?: string; }) {
        await this.getWorkspaceById(id);

        var newSlug;
        if (data.name) {
            newSlug = Util.generateSlug(data.name);
        }

        const existingWorkspace = await prisma.workspace.findUnique({
            where: { slug: newSlug }
        })

        if (existingWorkspace) {
            throw new BadRequestException("Workspace with this slug already exists");
        }

        const updateData: { name?: string; slug?: string; } = {};
        if (data.name !== undefined) updateData.name = data.name;
        updateData.slug = newSlug;

        return prisma.workspace.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                slug: true
            }
        });
    }

    static async deleteWorkspace(id: string) {
        await this.getWorkspaceById(id);
        return prisma.workspace.delete({
            where: { id },
        });
    }
}

export default WorkspaceService;