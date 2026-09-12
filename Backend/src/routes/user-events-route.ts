import express from "express";
import Authenticate from "../middleware/auth";
import { UserEventController } from "../controllers/user-events-controller";

const router = express.Router();
router.post("/", Authenticate, UserEventController.create);
export default router;
