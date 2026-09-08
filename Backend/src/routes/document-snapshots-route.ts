import express from "express";
import { DocumentSnapshotController } from "../controllers/document-snapshots-controller";
import Authenticate from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.use(Authenticate);

router.get("/:documentId/snapshots", DocumentSnapshotController.getDocumentSnapshots);
router.get("/:documentId/snapshots/:id", DocumentSnapshotController.getSnapshotById);
router.post("/:documentId/snapshots", DocumentSnapshotController.createSnapshot);
router.post("/:documentId/snapshots/:id/restore", DocumentSnapshotController.restoreSnapshot);
router.delete("/:documentId/snapshots/:id", DocumentSnapshotController.deleteSnapshot);

export default router;