import express from "express";
import { WorkspaceController } from "../controllers/workspaces-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

// Apply auth middleware if you want all user routes protected
router.use(Authenticate);

// Workspace archiving is paused for now.
// router.get("/archived", WorkspaceController.getArchivedWorkspaces);
// router.patch("/:id/archive", WorkspaceController.archiveWorkspace);
// router.patch("/:id/unarchive", WorkspaceController.restoreWorkspace);
router.get("/", WorkspaceController.getAllWorkspaces);
router.get("/:id", WorkspaceController.getWorkspaceById);
router.get("/slug/:slug", WorkspaceController.getWorkspaceBySlug);
router.post("/", WorkspaceController.createWorkspace);
router.put("/:id", WorkspaceController.updateWorkspace);
router.delete("/:id", WorkspaceController.deleteWorkspace);

export default router;
