import express from "express";
import { DocumentUpdateController } from "../controllers/document-updates-controller";
import Authenticate from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.use(Authenticate);

router.get("/:documentId/updates", DocumentUpdateController.getUpdates);
router.post("/:documentId/updates", DocumentUpdateController.addUpdate);
router.delete("/:documentId/updates", DocumentUpdateController.pruneUpdates);

export default router;