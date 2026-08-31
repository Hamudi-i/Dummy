import express from "express";
import { WorkspaceInviteController } from "../controllers/workspace-invites-controller";
import Authenticate from "../middleware/auth";

const router = express.Router({ mergeParams: true });
router.use(Authenticate)

router.get("/:workspaceId/invites", WorkspaceInviteController.getWorkspaceInvites);
router.post("/:workspaceId/invites", WorkspaceInviteController.createInvite);
router.post("/invites/:token/accept", WorkspaceInviteController.acceptInvite);
router.delete("/invites/:id", WorkspaceInviteController.revokeInvite);

export default router;