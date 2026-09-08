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

// Centralized error handling
app.use(exceptionFilter);

app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost:${port}`);
});

export default app;
