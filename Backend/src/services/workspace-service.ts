import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "src/infrastructure/http-exceptions";

export class WorkspaceService {
    static async getAllWorkspaces () {
        return prisma.workspace.findMany({
            select:{
                id: true,
                name: true,
                slug: true,
                createdAtAt: true,
                updatedAt: true,
                members: true,
                documents: true,
                invites: true
            },
            orderBy: {createdAt: "desc"},
        });
    }
}

export default WorkspaceService;