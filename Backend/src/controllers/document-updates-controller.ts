import { Request, Response, NextFunction } from "express";
import { DocumentUpdateService } from "../services/document-update-service";

/* FIXME
 * Document Updates & Snapshots: 
 * document-updates-controller.ts and document-snapshots-controller.ts
 *  take a documentId but don't verify if the requester belongs to that document's workspace. Any logged-in user with a document UUID could read or prune updates
*/
export class DocumentUpdateController {
    static async getUpdates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const since = req.query.sinceId as string | undefined;
            const updates = await DocumentUpdateService.getUpdateSince(documentId, since);
            res.status(200).json({ count: updates.length, data: updates });
        } catch (error) {
            next(error);
        }
    }

    static async addUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            let updateBlob: Buffer;

            if (Buffer.isBuffer(req.body)) {
                updateBlob = req.body;
            } else if (req.body.updateBlob) {
                updateBlob = Buffer.from(req.body.updateBlob, "base64");
            } else {
                updateBlob = Buffer.from(req.body, "base64");
            }

            const result = await DocumentUpdateService.addUpdate(documentId, updateBlob);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async pruneUpdates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documentId = req.params.documentId as string;
            const upToId = req.query.upToId as string | undefined;
            const result = await DocumentUpdateService.pruneUpdates(documentId, upToId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default DocumentUpdateController;