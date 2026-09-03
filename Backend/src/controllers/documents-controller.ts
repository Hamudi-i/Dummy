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

    static async createDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const authorId = (req.params as any).currentUser.userId;
            const document = await DocumentService.createDocument(workspaceId, authorId, req.body);
            res.status(201).json(document);
        } catch (error) {
            next(error);
        }
    }

    static async updateDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const updatedDocument = await DocumentService.updateDocument(id, req.body);
            res.status(200).json(updatedDocument);
        } catch (error) {
            next(error);
        }
    }

    static async archiveDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const archivedDocument = await DocumentService.setArchiveStatus(id, true);
            res.status(200).json(archivedDocument);
        } catch (error) {
            next(error);
        }
    }

    static async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await DocumentService.deleteDocument(id);
            res.status(200).json({ message: "Document deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default DocumentController;