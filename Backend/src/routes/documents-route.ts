import express from "express";
import { DocumentController } from "../controllers/documents-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

router.use(Authenticate);

router.get("/documents/:id", DocumentController.getDocumentById);
router.get("/workspaces/:workspaceId/documents", DocumentController.listWorkspaceDocuments);
router.post("/workspaces/:workspaceId/documents", DocumentController.createWorkspaceDocument);
router.put("/documents/:id", DocumentController.updateDocumentMetadata);
router.patch("/documents/:id/archive", DocumentController.archiveDocumentById);
router.patch("/documents/:id/unarchive", DocumentController.restoreDocumentById);
router.delete("/documents/:id", DocumentController.deleteDocumentById);

export default router;
