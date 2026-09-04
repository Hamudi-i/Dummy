import express from "express";
import { DocumentController } from "../controllers/documents-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

router.use(Authenticate);

router.get("/documents/:id", DocumentController.getDocumentById);
router.get("/workspaces/:workspaceId/documents", DocumentController.getWorkspaceDocument);
router.post("/workspaces/:workspaceId/documents", DocumentController.createDocument);
router.put("/documents/:id", DocumentController.updateDocument);
router.patch("/documents/:id/archive", DocumentController.archiveDocument);
router.patch("/documents/:id/unarchive", DocumentController.restoreDocument);
router.delete("/documents/:id", DocumentController.deleteDocument);

export default router;