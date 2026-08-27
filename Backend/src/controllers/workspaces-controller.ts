import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../services/workspace-service";

export class WorkspaceController {
    static async getAllWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaces = await WorkspaceService.getAllWorkspaces();
            res.status(200).json({ count: workspaces.length, data: workspaces });
        } catch (error) {
            next(error);
        }
    }

    static async getWorkspaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const workspace = await WorkspaceService.getWorkspaceById(id);
            res.status(200).json(workspace);
        } catch (error) {
            next(error);
        }
    }

    static async getWorkspaceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slug = req.params.slug as string;
            const workspace = await WorkspaceService.getWorkspaceBySlug(slug);
            res.status(200).json(workspace);
        } catch (error) {
            next(error);
        }
    }

    static async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newWorkspace = await WorkspaceService.createWorkspace(req.body);
            res.status(201).json(newWorkspace);
        } catch (error) {
            next(error);
        }
    }

    static async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const updatedWorkspace = await WorkspaceService.updateWorkspace(id, req.body);
            res.status(200).json(updatedWorkspace);
        } catch (error) {
            next(error);
        }
    }

    static async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await WorkspaceService.deleteWorkspace(id);
            res.status(200).json({ message: "Workspace deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default WorkspaceController