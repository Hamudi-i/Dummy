import express from "express";
import Authenticate from "../middleware/auth";
import { SupportRequestController } from "../controllers/support-requests-controller";

const router = express.Router();
router.post("/", Authenticate, SupportRequestController.create);
export default router;
