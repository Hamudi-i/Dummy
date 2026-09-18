import { Server } from "@hocuspocus/server";
import * as Y from "yjs";
import jwt from "jsonwebtoken";
import prisma from "../infrastructure/prisma";

// TODO Implement websocket features
export interface CollaborationUserContext {
    user: {
        id: string;
        email: string;
        role?: string;
    };
}

export function createCollaborationServer() {
    const collaborationServer = new Server<CollaborationUserContext>({
        name: "colab-collaboration-server",
        // Debounce saves to PostgreSQL: wait 2 seconds of inactivity before writing to database
        debounce: 2000,
        // Max debounce: guarantee a save at least every 10 seconds during continuous edits
        maxDebounce: 10000,

        /**
         * 1. Authentication Hook
         * Authenticates the incoming connection using JWT bearer token.
         * Token can be sent via the Hocuspocus provider token option or ?token= query parameter.
         */
        async onAuthenticate(data) {
            const token = data.token || data.requestParameters.get("token");

            if (!token) {
                throw new Error("Unauthorized: Authentication token is required.");
            }

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("Server configuration error: JWT_SECRET is not configured.");
            }

            try {
                const decoded = jwt.verify(token, jwtSecret) as {
                    userId?: string;
                    id?: string;
                    email: string;
                    role?: string;
                };

                const userId = decoded.userId || decoded.id;
                if (!userId) {
                    throw new Error("Invalid token payload: missing user identifier.");
                }

                return {
                    user: {
                        id: userId,
                        email: decoded.email,
                        role: decoded.role,
                    },
                };
            } catch (err: any) {
                console.warn("[collaboration] Authentication failed:", err?.message || err);
                throw new Error("Unauthorized: Invalid or expired token.");
            }
        },

        /**
         * 2. Load Document Hook
         * Triggered when the first peer opens a document.
         * Verifies the user has access to the document's workspace,
         * and initializes the Y.Doc state from PostgreSQL if a binary snapshot exists.
         */
        async onLoadDocument(data) {
            const { documentName, context } = data;
            const docId = documentName.replace(/^notebook-/, "");

            const userId = context?.user?.id;
            if (!userId) {
                throw new Error("Unauthorized: Unauthenticated user cannot load document.");
            }

            const document = await prisma.document.findUnique({
                where: { id: docId },
                include: {
                    workspace: {
                        include: {
                            members: {
                                where: { userId },
                            },
                        },
                    },
                },
            });

            if (!document) {
                throw new Error(`Document not found: ${docId}`);
            }

            // Check if user is a member of the workspace owning the document
            const isMember = document.workspace.members.length > 0;
            if (!isMember) {
                throw new Error("Access denied: You are not a member of this document's workspace.");
            }

            // If document already has saved binary CRDT state in Postgres, load it into Y.Doc
            if (document.crdtState) {
                return new Uint8Array(document.crdtState);
            }

            return data.document;
        },

        /**
         * 3. Store Document Hook
         * Automatically debounced by Hocuspocus.
         * Saves the latest binary CRDT state of the Y.Doc to PostgreSQL.
         */
        async onStoreDocument(data) {
            const { documentName, document } = data;
            const docId = documentName.replace(/^notebook-/, "");

            try {
                const state = Y.encodeStateAsUpdate(document);

                await prisma.document.update({
                    where: { id: docId },
                    data: {
                        crdtState: Buffer.from(state),
                        updatedAt: new Date(),
                    },
                });
                console.log(`[collaboration] Successfully persisted CRDT state for document: ${docId}`);
            } catch (error) {
                console.error(`[collaboration] Failed to persist document ${docId}:`, error);
            }
        },

        /**
         * 4. Change Hook
         * Emitted on each micro-diff from connected clients.
         * Appends micro-updates to the DocumentUpdate audit table asynchronously.
         */
        async onChange(data) {
            const { documentName, update } = data;
            const docId = documentName.replace(/^notebook-/, "");

            if (update && update.length > 0) {
                prisma.documentUpdate
                    .create({
                        data: {
                            documentId: docId,
                            updateBlob: Buffer.from(update),
                        },
                    })
                    .catch((err) => {
                        console.error(`[collaboration] Failed to write DocumentUpdate micro-diff for ${docId}:`, err);
                    });
            }
        },
    });

    return collaborationServer;
}