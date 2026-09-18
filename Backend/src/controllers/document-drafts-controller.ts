import { NextFunction, Request, Response } from "express";
import { DocumentDraftService } from "../services/document-draft-service";

export class DocumentDraftController {
  static async getDocumentDraft(req: Request, res: Response, next: NextFunction) {
    try { res.json(await DocumentDraftService.get(req.params.documentId as string, (req as any).currentUser.userId)); }
    catch (error) { next(error); }
  }
  static async saveDocumentDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, isUnsaved } = req.body;
      if (typeof content !== "string") throw new Error("Draft content is required");
      res.status(200).json(await DocumentDraftService.save(req.params.documentId as string, (req as any).currentUser.userId, content, isUnsaved));
    } catch (error) { next(error); }
  }
  static async deleteDocumentDraft(req: Request, res: Response, next: NextFunction) {
    try { await DocumentDraftService.remove(req.params.documentId as string, (req as any).currentUser.userId); res.sendStatus(204); }
    catch (error) { next(error); }
  }
}
