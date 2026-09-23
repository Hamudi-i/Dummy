import prisma from "../infrastructure/prisma";
import { WorkspaceRole } from "../../generated/prisma/enums";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import crypto from "crypto";
export class WorkspaceInviteService {
    static async getMyPendingInvites(userEmail: string) {
        if (!userEmail) return [];
        const normalizedEmail = userEmail.toLowerCase().trim();
        return prisma.workspaceInvite.findMany({
            where: {
                email: normalizedEmail,
                status: "PENDING",
                expiresAt: { gt: new Date() },
            },
            select: {
                id: true,
                workspaceId: true,
                email: true,
                role: true,
                status: true,
                token: true,
                expiresAt: true,
                createdAt: true,
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                    },
                },
                invitedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getWorkspaceInvites(workspaceId: string) {
        return prisma.workspaceInvite.findMany({
            where: { workspaceId, status: "PENDING" },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                token: true,
                expiresAt: true,
                createdAt: true,
                invitedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    static async createInvite(workspaceId: string, invitedById: string, email: string, role: WorkspaceRole = "MEMBER") {
        if (!email) {
            throw new BadRequestException("Email is required");
        }

        const normalizedEmail = email.toLocaleLowerCase().trim();

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        });
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        const existingUser = await prisma.user.findFirst({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            const isMember = await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: existingUser.id,
                    },
                },
            });
            if (isMember) {
                throw new BadRequestException("User is already a member of this workspace");
            }
        }

        const existingInvite = await prisma.workspaceInvite.findFirst({
            where: {
                workspaceId,
                email: normalizedEmail,
                status: "PENDING",
                expiresAt: { gt: new Date() },
            },
        });
        if (existingInvite) {
            throw new BadRequestException("Invite already exists");
        }

        // Generate unique token for invite, 7 day expiration
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        return prisma.workspaceInvite.create({
            data: {
                workspaceId,
                invitedById,
                email: normalizedEmail,
                role,
                token,
                expiresAt,
            },
            select: {
                id: true,
                workspaceId: true,
                email: true,
                role: true,
                status: true,
                token: true,
                expiresAt: true,
                createdAt: true,
            },
        });
    }

    static async acceptInvite(tokenOrId: string, userId: string, userEmail?: string) {
        const invite = await prisma.workspaceInvite.findFirst({
            where: {
                OR: [
                    { token: tokenOrId },
                    { id: tokenOrId },
                ],
            },
        });
        if (!invite) {
            throw new NotFoundException("Invite not found");
        }

        if (userEmail && invite.email.toLowerCase() !== userEmail.toLowerCase().trim()) {
            throw new BadRequestException("This invite was issued to a different email address");
        }

        if (invite.status !== "PENDING") {
            if (invite.status === "ACCEPTED") {
                const existingMember = await prisma.workspaceMember.findUnique({
                    where: {
                        workspaceId_userId: {
                            workspaceId: invite.workspaceId,
                            userId,
                        },
                    },
                });
                return {
                    message: "Invite already accepted",
                    member: existingMember,
                };
            }
            throw new BadRequestException("Invite is no longer pending");
        }

        if (new Date(invite.expiresAt) < new Date()) {
            await prisma.workspaceInvite.update({
                where: { id: invite.id },
                data: {
                    status: "EXPIRED",
                },
            });
            throw new BadRequestException("Invite has expired");
        }

        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: invite.workspaceId,
                    userId,
                },
            },
        });

        if (existingMember) {
            await prisma.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: "ACCEPTED" },
            });
            return {
                message: "You are already a member of this workspace",
                member: existingMember,
            };
        }

        return prisma.$transaction(async (tx) => {
            const member = await tx.workspaceMember.create({
                data: {
                    workspaceId: invite.workspaceId,
                    userId,
                    role: invite.role,
                },
            });

            await tx.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: "ACCEPTED" },
            });

            return {
                message: "invite accepted successfully",
                member,
            };
        });
    }

    static async declineInvite(tokenOrId: string, userEmail?: string) {
        const invite = await prisma.workspaceInvite.findFirst({
            where: {
                OR: [
                    { token: tokenOrId },
                    { id: tokenOrId },
                ],
            },
        });
        if (!invite) {
            throw new NotFoundException("Invite not found");
        }

        if (userEmail && invite.email.toLowerCase() !== userEmail.toLowerCase().trim()) {
            throw new BadRequestException("Not authorized to decline this invite");
        }

        await prisma.workspaceInvite.delete({
            where: { id: invite.id },
        });

        return { message: "Invite declined successfully" };
    }

    static async revokeInvite(id: string) {
        const invite = await prisma.workspaceInvite.findFirst({
            where: {
                OR: [
                    { id },
                    { token: id },
                ],
            },
        });
        if (!invite) {
            throw new NotFoundException("Invite not found");
        }

        return prisma.workspaceInvite.delete({
            where: { id: invite.id },
        });
    }
}

export default WorkspaceInviteService;