import { Request, Response, NextFunction } from "express";
import { WorkspaceMemberService } from "../services/workspace-member-services"

export class WorkspaceMembersController {
    static async getMembersByWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const members = await WorkspaceMemberService.getMemberByWorkspace(workspaceId);
            res.status(200).json({
                count: members.length,
                data: members
            });
        } catch (error) {
            next(error);
        }
    }

    static async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const { userId, role } = req.body;
            const member = await WorkspaceMemberService.addMember(workspaceId, userId, role);
            res.status(201).json(member);
        } catch (error) {
            next(error);
        }
    }

    static async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.params.userId as string;
            const { role } = req.body;
            const member = await WorkspaceMemberService.updateMemberRole(workspaceId, userId, role);
            res.status(200).json(member);
        } catch (error) {
            next(error);
        }
    }
}