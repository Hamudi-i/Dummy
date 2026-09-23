import express from "express";
import { WorkspaceInviteController } from "../controllers/workspace-invites-controller";
import Authenticate from "../middleware/auth";

const router = express.Router({ mergeParams: true });
router.use(Authenticate)

router.get("/invites/me", WorkspaceInviteController.getMyInvites);
router.post("/invites/:token/accept", WorkspaceInviteController.acceptInvite);
router.post("/invites/:token/decline", WorkspaceInviteController.declineInvite);
router.delete("/invites/:id", WorkspaceInviteController.revokeInvite);

router.get("/:workspaceId/invites", WorkspaceInviteController.getWorkspaceInvites);
router.get("/workspaces/:workspaceId/invites", WorkspaceInviteController.getWorkspaceInvites);
router.post("/:workspaceId/invites", WorkspaceInviteController.createInvite);
router.post("/workspaces/:workspaceId/invites", WorkspaceInviteController.createInvite);

export default router;