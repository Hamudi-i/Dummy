import express from "express";
import { UserController } from "../controllers/users-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

// Apply auth middleware if you want all user routes protected
router.use(Authenticate);

router.get("/me", UserController.getCurrentUser);
router.patch("/me", UserController.updateCurrentUser);
router.put("/me/password", UserController.changeCurrentPassword);
router.get("/", UserController.getAllUsers);
router.get("/email/:email", UserController.getUserByEmail);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
