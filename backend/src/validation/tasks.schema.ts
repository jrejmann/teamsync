import { z } from "zod";
import { TaskStatus } from "@prisma/client";

import { idSchema } from "./common.schema";

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  status: z.enum(TaskStatus).optional(),
  projectId: z
    .union([z.coerce.number().int().positive(), z.null()])
    .optional()
    .transform((v) => (v === null ? undefined : v)),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    status: z.enum(TaskStatus).optional(),
    projectId: z
      .union([z.coerce.number().int().positive(), z.null()])
      .optional(),
  })
  .refine(
    (body) =>
      body.title !== undefined ||
      body.status !== undefined ||
      body.projectId !== undefined,
    { message: "At least one of title, status, projectId is required" },
  );

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;

export const createTaskRequestSchema = z.object({
  body: createTaskBodySchema,
});

export const updateTaskRequestSchema = z.object({
  params: idSchema,
  body: updateTaskBodySchema,
});
