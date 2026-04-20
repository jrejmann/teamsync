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
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/projects", projectsRouter);
app.use("/tasks", tasksRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received, closing server`);
  server.close(() => {
    void prisma.$disconnect().then(() => process.exit(0));
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
