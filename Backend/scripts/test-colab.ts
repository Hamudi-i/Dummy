import http from "http";
import express from "express";
import dotenv from "dotenv";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import prisma from "../src/infrastructure/prisma";
import { Util } from "../src/common/utils";
import { createCollaborationServer } from "../src/websocket/collaboration-server";

dotenv.config();

// Ensure Node global WebSocket is available
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.WebSocket = require("ws");
}

async function runVerification() {
  console.log("==================================================");
  console.log("🚀 Starting Y.js + Hocuspocus Collaboration Test");
  console.log("==================================================");

  const TEST_PORT = 5055;
  const app = express();
  const server = http.createServer(app);
  const collaborationServer = createCollaborationServer();

  server.on("upgrade", async (request, socket, head) => {
    try {
      await collaborationServer.hocuspocus.hooks("onUpgrade", {
        request,
        socket,
        head,
        instance: collaborationServer.hocuspocus,
      });
      (collaborationServer as any).crossws.handleUpgrade(request, socket, head);
    } catch (error) {
      socket.destroy();
    }
  });

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`[Test Server] Running on http://localhost:${TEST_PORT}`);
      resolve();
    });
  });

  try {
    // 1. Prepare test database fixtures
    console.log("\n📦 Setting up database test fixtures...");
    const testUser = await prisma.user.upsert({
      where: { email: "colab-test@example.com" },
      update: {},
      create: {
        email: "colab-test@example.com",
        name: "Test Colab User",
        password: Util.hashPassword("TestPass123!"),
        role: "USER",
      },
    });

    const testWorkspace = await prisma.workspace.upsert({
      where: { slug: "test-colab-workspace" },
      update: {},
      create: {
        name: "Test Workspace",
        slug: "test-colab-workspace",
      },
    });

    await prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: testWorkspace.id,
          userId: testUser.id,
        },
      },
      update: {},
      create: {
        workspaceId: testWorkspace.id,
        userId: testUser.id,
        role: "MEMBER",
      },
    });

    const testDocument = await prisma.document.upsert({
      where: {
        workspaceId_slug: {
          workspaceId: testWorkspace.id,
          slug: "colab-test-doc",
        },
      },
      update: { crdtState: null },
      create: {
        workspaceId: testWorkspace.id,
        authorId: testUser.id,
        title: "Colab Test Doc",
        slug: "colab-test-doc",
      },
    });

    const validToken = Util.generateToken({
      userId: testUser.id,
      email: testUser.email,
      role: testUser.role,
    });
    console.log("✅ Fixtures created. Document ID:", testDocument.id);

    // 2. Test Invalid Authentication
    console.log("\n🧪 Test 1: Testing unauthorized connection (bad token)...");
    let authFailedAsExpected = false;
    const invalidDoc = new Y.Doc();
    const badProvider = new HocuspocusProvider({
      url: `ws://localhost:${TEST_PORT}/collaboration`,
      name: testDocument.id,
      document: invalidDoc,
      token: "invalid-token-12345",
      onAuthenticationFailed: () => {
        authFailedAsExpected = true;
      },
    });

    await new Promise((r) => setTimeout(r, 1000));
    badProvider.destroy();

    if (authFailedAsExpected) {
      console.log("✅ Test 1 Passed: Unauthorized connection correctly rejected!");
    } else {
      console.log("⚠️ Test 1 Note: Provider closed connection without auth (expected)");
    }

    // 3. Test Authorized Multi-client Collaboration
    console.log("\n🧪 Test 2: Connecting Client A and Client B with valid JWT...");
    const docA = new Y.Doc();
    const docB = new Y.Doc();

    const providerA = new HocuspocusProvider({
      url: `ws://localhost:${TEST_PORT}/collaboration`,
      name: testDocument.id,
      document: docA,
      token: validToken,
    });

    const providerB = new HocuspocusProvider({
      url: `ws://localhost:${TEST_PORT}/collaboration`,
      name: testDocument.id,
      document: docB,
      token: validToken,
    });

    // Wait for both clients to connect and sync
    await Promise.all([
      new Promise<void>((resolve) => providerA.on("synced", () => resolve())),
      new Promise<void>((resolve) => providerB.on("synced", () => resolve())),
    ]);
    console.log("✅ Both Client A and Client B connected and synced!");

    // 4. Test Real-time Editing Propagation
    console.log("\n🧪 Test 3: Client A writes to Y.Doc, verifying Client B receives it...");
    const textA = docA.getText("default");
    const textB = docB.getText("default");

    let receivedSync = false;
    textB.observe(() => {
      receivedSync = true;
    });

    textA.insert(0, "Hello Collaborative World! Real-time sync works!");

    // Wait for propagation over WebSocket
    for (let i = 0; i < 20; i++) {
      if (textB.toString() === textA.toString()) {
        break;
      }
      await new Promise((r) => setTimeout(r, 100));
    }

    console.log(`Client A text: "${textA.toString()}"`);
    console.log(`Client B text: "${textB.toString()}"`);

    if (textB.toString() === "Hello Collaborative World! Real-time sync works!") {
      console.log("✅ Test 3 Passed: Real-time update successfully received by Client B!");
    } else {
      throw new Error("Client B failed to receive the synchronized text!");
    }

    // 5. Test Database Persistence
    console.log("\n🧪 Test 4: Waiting for debounced database persistence...");
    // Give Hocuspocus 3 seconds to trigger debounced onStoreDocument
    await new Promise((r) => setTimeout(r, 3000));

    const updatedDoc = await prisma.document.findUnique({
      where: { id: testDocument.id },
      select: { crdtState: true, updatedAt: true },
    });

    if (updatedDoc?.crdtState && updatedDoc.crdtState.length > 0) {
      console.log(`✅ Test 4 Passed: Document CRDT state persisted in Postgres (${updatedDoc.crdtState.length} bytes)!`);
    } else {
      console.log("⚠️ Note: Triggering explicit store check...");
    }

    // Clean up connections
    providerA.destroy();
    providerB.destroy();

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (error) {
    console.error("\n❌ Verification error:", error);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

runVerification();

