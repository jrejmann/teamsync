import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import prisma from "./lib/prisma";
import tasksRoutes from "./routes/tasks.routes";
import projectsRouter from "./routes/projects.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const corsOptions = process.env.CORS_ORIGIN
  ? {
      origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    }
  : undefined;

app.use(cors(corsOptions));
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not_ready" });
  }
});

app.use("/projects", projectsRouter);
app.use("/tasks", tasksRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const SHUTDOWN_MS = 15_000;

function shutdown(signal: string): void {
  console.log(`${signal} received, closing server`);
  const timeout = setTimeout(() => process.exit(1), SHUTDOWN_MS);
  server.close(() => {
    clearTimeout(timeout);
    void prisma.$disconnect().then(() => process.exit(0));
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
