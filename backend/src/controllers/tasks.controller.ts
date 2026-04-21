import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../lib/appError";
import { asyncHandler } from "../lib/asyncHandler";
import type {
  CreateTaskBody,
  UpdateTaskBody,
} from "../validation/tasks.schema";

import type { IdParams, ListQuery } from "../validation/common.schema";

async function assertProjectExists(projectId: number): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
  }
}

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as ListQuery;
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

export const getTaskById = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError(404, "Task not found", "NOT_FOUND");
    }

    res.json(task);
  },
);

export const getTasksByProjectId = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id: projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
    }

    res.json(project.tasks);
  },
);

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateTaskBody;

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

export const updateTask = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;
    const body = req.body as UpdateTaskBody;

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
  },
);

export const deleteTask = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  },
);
