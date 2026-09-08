import prisma from "../infrastructure/prisma";
import { NotFoundException, BadRequestException } from "../infrastructure/http-exceptions";

export class DocumentSnapshotService {
    // 1. Get version history timeline (exclude heavy binary blob for fast loading)
    static async getDocumentSnapshots(documentId: string) {
        return prisma.documentSnapshot.findMany({
            where: { documentId },
            select: {
                id: true,
                documentId: true,
                summary: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    static async getSnapshotById(id: string) {
        const snapshot = await prisma.documentSnapshot.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });
        if (!snapshot) {
            throw new NotFoundException("Snapshot not found");
        }

        return snapshot;
    }

    static async createSnapshot(documentId: string, createdById?: string, summary?: string, customCrdtState?: Buffer) {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            select: { id: true, crdtState: true }
        });

        if (!document) {
            throw new NotFoundException("Document not found");
        }

        // use provided binary state, or capture the document's current state
        const stateToSave = customCrdtState || document.crdtState;
        if (!stateToSave) {
            throw new BadRequestException("No document state availabele to snapshot");
        }

        return prisma.documentSnapshot.create({
            data: {
                documentId,
                createdById,
                summary: summary || "Auto-saved version",
                crdtState: new Uint8Array(stateToSave)
            },
            select: {
                id: true,
                documentId: true,
                summary: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });
    }

    // Get single historical snapshot (include the binary blob)

    // Restore document to this snapshot's state
    static async restoreSnapshot(documentId: string, snapshotId: string) {
        const snapshot = await this.getSnapshotById(snapshotId);
        if (snapshot.documentId !== documentId) {
            throw new BadRequestException("Snapshot does not belong to this document");
        }

        return prisma.document.update({
            where: { id: documentId },
            data: {
                crdtState: snapshot.crdtState
            },
            select: {
                id: true,
                title: true,
                updatedAt: true
            }
        })
    }

    static async deleteSnapshot(id: string) {
        const snapshot = await prisma.documentSnapshot.findUnique({
            where: { id }
        });
        if (!snapshot) {
            throw new NotFoundException("Snapshot not found");
        }

        return prisma.documentSnapshot.delete({
            where: { id }
        });
    }
}

export default DocumentSnapshotService;