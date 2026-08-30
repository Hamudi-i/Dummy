import express from "express";
import { WorkspaceMembersController } from "../controllers/workspace-members-controller";
import Authenticate from "../middleware/auth";

//Merging params so that we can use :workspaceId if needed/nested
const router = express.Router({ mergeParams: true });

router.use(Authenticate);

router.get("/:workspaceId/members", WorkspaceMembersController.getMembersByWorkspace);
router.post("/:workspaceId/members", WorkspaceMembersController.addMember);
router.put("/:workspaceId/members/:userId", WorkspaceMembersController.updateRole);
router.delete("/members/:id", WorkspaceMembersController.removeMember);

export default router;