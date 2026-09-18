import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../services/workspace-service";

export class WorkspaceController {
    static async getAllWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).currentUser.userId;
            const workspaces = await WorkspaceService.getAllWorkspaces(userId);
            res.status(200).json({ count: workspaces.length, data: workspaces });
        } catch (error) {
            next(error);
        }
    }

    static async getWorkspaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const workspace = await WorkspaceService.getWorkspaceById(id, userId);
            res.status(200).json(workspace);
        } catch (error) {
            next(error);
        }
    }

    static async getWorkspaceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slug = req.params.slug as string;
            const userId = (req as any).currentUser.userId;
            const workspace = await WorkspaceService.getWorkspaceBySlug(slug, userId);
            res.status(200).json(workspace);
        } catch (error) {
            next(error);
        }
    }

    static async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).currentUser.userId;
            const newWorkspace = await WorkspaceService.createWorkspace(req.body, userId);
            res.status(201).json(newWorkspace);
        } catch (error) {
            next(error);
        }
    }

    static async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const updatedWorkspace = await WorkspaceService.updateWorkspace(id, userId, req.body);
            res.status(200).json(updatedWorkspace);
        } catch (error) {
            next(error);
        }
    }

    static async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            await WorkspaceService.deleteWorkspace(id, userId);
            res.status(200).json({ message: "Workspace deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default WorkspaceController
