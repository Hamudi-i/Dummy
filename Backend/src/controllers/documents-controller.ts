import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../services/document-service";

export class DocumentController {
    static async listWorkspaceDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = (req as any).currentUser.userId;
            const isArchived = req.query.archived === "true";
            const document = await DocumentService.getWorkspaceDocuments(workspaceId, userId, { isArchived });
            res.status(200).json(document);
        } catch (error) {
            next(error);
        }
    }

    static async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const document = await DocumentService.getDocumentById(id, userId);
            res.status(200).json(document);
        } catch (error) {
            next(error);
        }
    }

    static async createWorkspaceDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = req.params.workspaceId as string;
            const authorId = (req as any).currentUser.userId;
            const document = await DocumentService.createDocument(workspaceId, authorId, req.body);
            res.status(201).json(document);
        } catch (error) {
            next(error);
        }
    }

    static async updateDocumentMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const updatedDocument = await DocumentService.updateDocument(id, userId, req.body);
            res.status(200).json(updatedDocument);
        } catch (error) {
            next(error);
        }
    }

    static async archiveDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const archivedDocument = await DocumentService.setArchiveStatus(id, userId, true);
            res.status(200).json(archivedDocument);
        } catch (error) {
            next(error);
        }
    }

    // Un-archive document 
    // /api/do
    static async restoreDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            const restoredDocument = await DocumentService.setArchiveStatus(id, userId, false);
            res.status(200).json(restoredDocument);
        } catch (error) {
            next(error);
        }
    }

    static async deleteDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const userId = (req as any).currentUser.userId;
            await DocumentService.deleteDocument(id, userId);
            res.status(200).json({ message: "Document deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default DocumentController;
