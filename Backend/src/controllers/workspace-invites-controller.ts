import { Request, Response, NextFunction } from "express";
import { WorkspaceInviteService } from "../services/workspace-invite-service";

export class WorkspaceInviteController {
    static async getWorkspaceInvites(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.id as string;
            const invite = await WorkspaceInviteService.getWorkspaceInvites(workspaceId);
            res.status(200).json(invite);
        } catch (error) {
            next(error);
        }
    }

    static async createInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const invitedById = (req as any).currentUser.userId;
            const { email, role } = req.body;

            const invite = await WorkspaceInviteService.createInvite(workspaceId, invitedById, email, role);
            res.status(200).json(invite);
        } catch (error) {
            next(error);
        }
    }

    static async acceptInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.params.token as string;
            const userId = (req as any).currentUser.userId as string;

            const result = await WorkspaceInviteService.acceptInvite(token, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async revokeInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await WorkspaceInviteService.revokeInvite(id);

            res.status(200).json({ message: "Invite revoked successfully" });
        } catch (error) {
            next(error)
        }
    }
}