import { Request, Response, NextFunction } from "express";
import { DocumentSnapshotService } from "../services/document-snapshot-service";

export class DocumentSnapshotController {
    static async getRecentSnapshotsForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).currentUser?.userId as string;
            const snapshots = await DocumentSnapshotService.getRecentSnapshotsForUser(userId);
            res.status(200).json(snapshots);
        } catch (error) {
            next(error);
        }
    }

    static async listDocumentSnapshots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const snapshots = await DocumentSnapshotService.getDocumentSnapshots(documentId);
            res.status(200).json({ count: snapshots.length, data: snapshots });
        } catch (error) {
            next(error);
        }
    }

    static async getDocumentSnapshotById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const snapshotId = req.params.id as string;
            const snapshot = await DocumentSnapshotService.getSnapshotById(snapshotId);
            res.status(200).json(snapshot);
        } catch (error) {
            next(error);
        }
    }

    static async createDocumentSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const createdById = (req as any).currentUser?.userId;
            const { summary } = req.body;
            const snapshot = await DocumentSnapshotService.createSnapshot(documentId, createdById, summary);
            res.status(201).json(snapshot);
        } catch (error) {
            next(error);
        }
    }

    static async restoreDocumentSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const snapshotId = req.params.id as string;

            const restore = await DocumentSnapshotService.restoreSnapshot(documentId, snapshotId);
            res.status(200).json(restore);
        } catch (error) {
            next(error);
        }
    }

    static async deleteDocumentSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
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
