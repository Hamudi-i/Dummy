import prisma from "../infrastructure/prisma";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import { WorkspaceRole } from "../../generated/prisma/enums";

export class WorkspaceMemberService {
    static async getMemberByWorkspace(workspaceId: string) {
        return prisma.workspaceMember.findMany({
            where: {
                workspaceId
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                joinedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { joinedAt: "asc" }
        });
    }

    static async addMember(workspaceId: string, userId: string, role: WorkspaceRole = "MEMBER") {
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (existingMember) {
            throw new BadRequestException("User is already a member of the workspace");
        }

        return prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                joinedAt: true
            }
        });
    }

    static async updateMemberRole(workspaceId: string, userId: string, role: WorkspaceRole) {
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!existingMember) {
            throw new NotFoundException("User is not a member of this workspace");
        }

        return prisma.workspaceMember.update({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
            data: { role },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                joinedAt: true,
            },

        });
    }

    //FDon't use the UserID here, use the row's ID
    static async removeMember(id: string) {
        const member = await prisma.workspaceMember.findUnique({
            where: { id }
        });

        if (!member) {
            throw new NotFoundException("Member not found");
        }

        return prisma.workspaceMember.delete({
            where: { id }
        });

    }
}

export default WorkspaceMemberService;