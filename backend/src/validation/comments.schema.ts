import { z } from "zod";

export const taskIdOnlySchema = z.object({
  taskId: z.coerce.number().int().positive(),
});

export const taskCommentParamsSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});

export type TaskIdRouteParams = z.infer<typeof taskIdOnlySchema>;
export type TaskCommentRouteParams = z.infer<typeof taskCommentParamsSchema>;

export const taskIdParamSchema = z.object({
  params: taskIdOnlySchema,
});

export const taskCommentParamSchema = z.object({
  params: taskCommentParamsSchema,
});

export const createCommentBodySchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export const updateCommentBodySchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
export type UpdateCommentBody = z.infer<typeof updateCommentBodySchema>;

export const createCommentRequestSchema = z.object({
  params: taskIdOnlySchema,
  body: createCommentBodySchema,
});

export const updateCommentRequestSchema = z.object({
  params: taskCommentParamsSchema,
  body: updateCommentBodySchema,
});
