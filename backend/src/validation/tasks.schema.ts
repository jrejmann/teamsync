import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  status: z.enum(TaskStatus).optional(),
  projectId: z.number().int().positive().optional(),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    status: z.enum(TaskStatus).optional(),
    projectId: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (body) =>
      body.title !== undefined ||
      body.status !== undefined ||
      body.projectId !== undefined,
    { message: "At least one of title, status, projectId is required" },
  );
