import express from "express";
import { AuthController } from "../controllers/auth-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginWithEmailAndPassword);
router.get("/oauth/:provider", AuthController.redirectToOAuthProvider);
router.get("/oauth/:provider/callback", AuthController.completeOAuthSignIn);
router.post("/oauth/:provider/callback", AuthController.completeOAuthSignIn);
router.get("/me", Authenticate, AuthController.getAuthenticatedUserProfile);

export default router;
