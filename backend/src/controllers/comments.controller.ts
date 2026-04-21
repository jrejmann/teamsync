import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../lib/appError";
import { asyncHandler } from "../lib/asyncHandler";
import type {
  CreateCommentBody,
  TaskCommentRouteParams,
  TaskIdRouteParams,
  UpdateCommentBody,
} from "../validation/comments.schema";

async function assertTaskExists(taskId: number): Promise<void> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!task) {
    throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
  }
}

export const getCommentsByTaskId = asyncHandler(
  async (req: Request<TaskIdRouteParams>, res: Response) => {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
    }

    res.json(task.comments);
  },
);

export const createComment = asyncHandler(
  async (req: Request<TaskIdRouteParams>, res: Response) => {
    const { taskId } = req.params;
    const body = req.body as CreateCommentBody;

    await assertTaskExists(taskId);

    const comment = await prisma.comment.create({
      data: {
        taskId,
        content: body.content,
      },
    });

    res.status(201).json(comment);
  },
);

export const updateComment = asyncHandler(
  async (req: Request<TaskCommentRouteParams>, res: Response) => {
    const { taskId, commentId } = req.params;
    const body = req.body as UpdateCommentBody;

    const existing = await prisma.comment.findFirst({
      where: { id: commentId, taskId },
    });

    if (!existing) {
      throw new AppError(404, "Comment not found", "NOT_FOUND");
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: body.content },
    });

    res.json(updated);
  },
);

export const deleteComment = asyncHandler(
  async (req: Request<TaskCommentRouteParams>, res: Response) => {
    const { taskId, commentId } = req.params;

    const existing = await prisma.comment.findFirst({
      where: { id: commentId, taskId },
    });

    if (!existing) {
      throw new AppError(404, "Comment not found", "NOT_FOUND");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send();
  },
);
