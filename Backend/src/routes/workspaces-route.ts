import express from "express";
import { WorkspaceController } from "../controllers/workspaces-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

// Apply auth middleware if you want all user routes protected
router.use(Authenticate);

//TODO make the workspace only visible to the person who is a member of the workspace

router.get("/", WorkspaceController.getAllWorkspaces);
router.get("/:id", WorkspaceController.getWorkspaceById);
router.get("/:slug", WorkspaceController.getWorkspaceBySlug);
router.post("/", WorkspaceController.createWorkspace);
router.put("/:id", WorkspaceController.updateWorkspace);
router.delete("/:id", WorkspaceController.deleteWorkspace);

export default router;