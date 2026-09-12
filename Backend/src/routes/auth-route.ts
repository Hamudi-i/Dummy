import express from "express";
import { AuthController } from "../controllers/auth-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/oauth/:provider", AuthController.startOAuth);
router.get("/oauth/:provider/callback", AuthController.finishOAuth);
router.post("/oauth/:provider/callback", AuthController.finishOAuth);
router.get("/me", Authenticate, AuthController.getProfile);

export default router;
