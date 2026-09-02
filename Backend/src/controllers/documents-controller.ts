import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../services/document-service";

export class DocumentController {
    static async getWorkspaceDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const document = await DocumentService.getWorkspaceDocuments(workspaceId);
            res.status(200).json(document);
        } catch (error) {
            next(error);
        }
    }

    static async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const document = await DocumentService.getDocumentById(id);
            res.status(200).json(document);
        } catch (error) {
            next(error);
        }
    }
}