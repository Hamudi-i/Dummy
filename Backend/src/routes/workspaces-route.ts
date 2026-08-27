import express from "express";
import { WorkspaceController } from "../controllers/workspaces-controller";
import Authenticate from "src/middleware/auth";

const router = express.Router();

// Apply auth middleware if you want all user routes protected
router.use(Authenticate);

router.get("/", WorkspaceController.getAllWorkspaces);

export default router;