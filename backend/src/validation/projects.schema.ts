import { z } from "zod";

import { idSchema } from "./common.schema";

const projectCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Z]{1,8}$/, "Code must contain only uppercase letters (max 8)");

export const createProjectBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  code: projectCodeSchema,
});

export const updateProjectBodySchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    code: projectCodeSchema.optional(),
  })
  .refine((body) => body.name !== undefined || body.code !== undefined, {
    message: "At least one of name or code is required",
  });

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;

export const createProjectRequestSchema = z.object({
  body: createProjectBodySchema,
});

export const updateProjectRequestSchema = z.object({
  params: idSchema,
  body: updateProjectBodySchema,
});
