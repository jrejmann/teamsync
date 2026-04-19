import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../lib/appError";
import { asyncHandler } from "../lib/asyncHandler";
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskBodySchema,
} from "../validation/tasks.schema";

async function assertProjectExists(projectId: number): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
  }
}

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = listTasksQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.task.count(),
  ]);

  res.json({
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdParamSchema.parse(req.params);

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    throw new AppError(404, "Task not found", "NOT_FOUND");
  }

  res.json(task);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const body = createTaskBodySchema.parse(req.body);

  if (body.projectId != null) {
    await assertProjectExists(body.projectId);
  }

  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      ...(body.status != null ? { status: body.status } : {}),
      ...(body.projectId != null ? { projectId: body.projectId } : {}),
    },
  });

  res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdParamSchema.parse(req.params);
  const body = updateTaskBodySchema.parse(req.body);

  if (typeof body.projectId === "number") {
    await assertProjectExists(body.projectId);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.projectId !== undefined ? { projectId: body.projectId } : {}),
    },
  });

  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdParamSchema.parse(req.params);

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});
