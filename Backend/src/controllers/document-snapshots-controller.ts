import { Request, Response, NextFunction } from "express";
import { DocumentSnapshotService } from "../services/document-snapshot-service";

export class DocumentSnapshotController {
    static async getDocumentSnapshots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const snapshots = await DocumentSnapshotService.getDocumentSnapshots(documentId);
            res.status(200).json({ count: snapshots.length, data: snapshots });
        } catch (error) {
            next(error);
        }
    }

    static async getSnapshotById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const snapshotId = req.params.snapshotId as string;
            const snapshot = await DocumentSnapshotService.getSnapshotById(snapshotId);
            res.status(200).json(snapshot);
        } catch (error) {
            next(error);
        }
    }

    static async createSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const createdById = (req as any).currentUser?.userId;
            const { summary } = req.body;
            const snapshot = await DocumentSnapshotService.createSnapshot(documentId, createdById, summary);
            res.sendStatus(201).json(snapshot);
        } catch (error) {
            next(error);
        }
    }

    static async restoreSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const snapshotId = req.params.id as string;

            const restore = await DocumentSnapshotService.restoreSnapshot(documentId, snapshotId);
            res.status(200).json(restore);
        } catch (error) {
            next(error);
        }
    }

    static async deleteSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await DocumentSnapshotService.deleteSnapshot(id);
            res.status(200).json({ message: "Snapshot deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default DocumentSnapshotController;