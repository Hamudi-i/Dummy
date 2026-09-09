import prisma from "../infrastructure/prisma";
import { NotFoundException, BadRequestException } from "../infrastructure/http-exceptions";

export class DocumentUpdateService {
    static async getUpdateSince(documentId: string, sinceId?: string) {
        const whereClause: any = { documentId };

        if (sinceId) {
            whereClause.id = { gt: parseInt(sinceId) }; // gt = greater than
        }

        const updates = await prisma.documentUpdate.findMany({
            where: whereClause,
            select: {
                id: true,
                documentId: true,
                updateBlob: true,
                createdAt: true
            },
            orderBy: { id: "asc" }
        });

        // Convert them bigInt IDs to string
        return updates.map(update => ({
            ...update,
            id: update.id.toString(),
            updateBlob: Buffer.from(update.updateBlob).toString("base64")
        }));
    }

    static async addUpdate(documentId: string, updateBlob: Buffer | Uint8Array) {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            select: { id: true }
        });
        if (!document) {
            throw new NotFoundException("Document not found");
        }

        if (!updateBlob) {
            throw new BadRequestException("Update blob is required");
        }

        const created = await prisma.documentUpdate.create({
            data: {
                documentId,
                updateBlob: new Uint8Array(updateBlob)
            },
            select: {
                id: true,
                documentId: true,
                createdAt: true
            }
        });

        return { ...created, id: created.id.toString() }; // Convert bigint to string for JSON serialization
    }

    // Prune: Delete updates up to certain ID (After merging into Document.crdtState)
    static async pruneUpdates(documentId: string, upToId?: string) {
        const whereClause: any = { documentId };

        if (upToId) {
            whereClause.id = { lte: BigInt(upToId) };
        }

        const result = await prisma.documentUpdate.deleteMany({ where: whereClause });

        return {
            message: `pruned ${result.count} updates`,
            count: result.count
        }
    }
}

export default DocumentUpdateService;