import http from "http";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import exceptionFilter from "./infrastructure/filters/exception-filter";
import authRoutes from "./routes/auth-route";
import userRoutes from "./routes/users-route";
import workspaceRoutes from "./routes/workspaces-route";
import workspaceMemberRoutes from "./routes/workspace-member-routes";
import workspaceInviteRoutes from "./routes/workspace-invite-route";
import documentRouters from "./routes/documents-route";
import documentSnapshotRoutes from "./routes/document-snapshots-route";
import documentUpdateRoutes from "./routes/document-updates-route";
import documentDraftRoutes from "./routes/document-drafts-route";
import { createCollaborationServer } from "./websocket/collaboration-server";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Allowed frontend origins, configured via CORS_ORIGINS env var
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin: any, callback: any) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public health check endpoints
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Backend API Starter Pack - OK");
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces", workspaceMemberRoutes);
app.use("/api", workspaceInviteRoutes);
app.use("/api", documentRouters);
app.use("/api/documents", documentSnapshotRoutes);
app.use("/api/documents", documentUpdateRoutes);
app.use("/api/documents", documentDraftRoutes);

// Centralized error handling
app.use(exceptionFilter);

// Create HTTP server wrapping Express
const server = http.createServer(app);

// Initialize Hocuspocus collaboration server
const collaborationServer = createCollaborationServer();

// Handle WebSocket upgrade requests on the same port
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
    if (error) {
      console.error("[server] WebSocket upgrade error:", error);
    }
    socket.destroy();
  }
});

server.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost:${port}`);
  console.log(`[server]: Collaboration WebSocket listening on ws://localhost:${port}/collaboration`);
});

export { server, collaborationServer };
export default app;

