import express from "express";
import Authenticate from "../middleware/auth";
import { DocumentDraftController } from "../controllers/document-drafts-controller";

const router = express.Router();
router.use(Authenticate);
router.get("/:documentId/draft", DocumentDraftController.get);
router.put("/:documentId/draft", DocumentDraftController.save);
router.delete("/:documentId/draft", DocumentDraftController.remove);
export default router;
