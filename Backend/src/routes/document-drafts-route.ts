import express from "express";
import Authenticate from "../middleware/auth";
import { DocumentDraftController } from "../controllers/document-drafts-controller";

const router = express.Router();
router.use(Authenticate);
router.get("/:documentId/draft", DocumentDraftController.getDocumentDraft);
router.put("/:documentId/draft", DocumentDraftController.saveDocumentDraft);
router.delete("/:documentId/draft", DocumentDraftController.deleteDocumentDraft);
export default router;
