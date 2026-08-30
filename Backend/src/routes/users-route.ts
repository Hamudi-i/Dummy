import express from "express";
import { UserController } from "../controllers/users-controller";
import Authenticate from "../middleware/auth";

const router = express.Router();

// Apply auth middleware if you want all user routes protected
router.use(Authenticate);

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.get("/email/:email", UserController.getUserByEmail);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
