import express from "express";
import { DocumentSnapshotController } from "../controllers/document-snapshots-controller";
import Authenticate from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.use(Authenticate);

router.get("/:documentId/snapshots", DocumentSnapshotController.listDocumentSnapshots);
router.get("/:documentId/snapshots/:id", DocumentSnapshotController.getDocumentSnapshotById);
router.post("/:documentId/snapshots", DocumentSnapshotController.createDocumentSnapshot);
router.post("/:documentId/snapshots/:id/restore", DocumentSnapshotController.restoreDocumentSnapshot);
router.delete("/:documentId/snapshots/:id", DocumentSnapshotController.deleteDocumentSnapshot);

export default router;
