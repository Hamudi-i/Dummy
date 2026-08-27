import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "src/services/workspace-service";

export class WorkspaceController {
    static async getAllWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const workspaces = await WorkspaceService.getAllWorkspaces();
            res.status(200).json({count: workspaces.length, data: workspaces});
        } catch(error){
            next(error);
        }
    }
}

export default WorkspaceController