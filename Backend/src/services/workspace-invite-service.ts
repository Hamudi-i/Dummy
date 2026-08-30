import prisma from "../infrastructure/prisma";
import { WorkspaceRole } from "../../generated/prisma/enums";
import { BadRequestException, NotFoundException } from "../infrastructure/http-exceptions";
import crypto from "crypto";
export class workspaceInviteService {
    async getWorkspaceInvites(workspaceId: string) {
        return prisma.workspaceInvite.findMany({
            where: { workspaceId },
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
                        email: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async createInvite(workspaceId: string, invitedById: string, email: string, role: WorkspaceRole = "MEMBER") {
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
                        userId: existingUser.id
                    }
                }
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
                expiresAt: { gt: new Date() }
            }
        });
        if (existingInvite) {
            throw new BadRequestException("Invite already exists");
        }

        //Generate unique token for invite, 7 day expiration
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7 days

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
            }
        });
    }

    static async acceptInvite(token: string, userId: string) {
        const invite = await prisma.workspaceInvite.findUnique({
            where: { token }
        });
        if (!invite) {
            throw new NotFoundException("Invite not found");
        }

        if (invite.status !== "PENDING") {
            throw new BadRequestException("Invite is no longer pending");
        }

        if (new Date(invite.expiresAt) < new Date()) {
            await prisma.workspaceInvite.update({
                where: { token },
                data: {
                    status: "EXPIRED"
                }
            });
            throw new BadRequestException("Invite has expired");
        }

        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: invite.workspaceId,
                    userId
                }
            }
        });

        if (existingMember) {
            throw new BadRequestException("User is already a member of this workspace");
        }

        //ima use single transaction to add member and accept invite as accepted
        return prisma.$transaction(async (tx) => {
            const member = await tx.workspaceMember.create({
                data: {
                    workspaceId: invite.workspaceId,
                    userId,
                    role: invite.role
                }
            });

            await tx.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: "ACCEPTED" },
            });

            return {
                message: "invite accepted successfully",
                member
            }
        });
    }

    static async revokeInvite(id: string) {
        const invite = await prisma.workspaceInvite.findUnique({
            where: { id }
        });
        if (!invite) {
            throw new NotFoundException("Invite not found");
        }

        return prisma.workspaceInvite.delete({
            where: { id }
        })
    }
}