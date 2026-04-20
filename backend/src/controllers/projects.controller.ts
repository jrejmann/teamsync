import { Request, Response } from "express";
import prisma from "../lib/prisma";

import { asyncHandler } from "../lib/asyncHandler";
import { IdParams, listQuerySchema } from "../validation/common.schema";

import {
  createProjectBodySchema,
  updateProjectBodySchema,
} from "../validation/projects.schema";

export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = listQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;

    const [projects, total] = await prisma?.$transaction([
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count(),
    ]);

    res.json({
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    });
  },
);

export const getProjectById = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;

    const project = await prisma.project.findUniqueOrThrow({ where: { id } });

    res.json(project);
  },
);

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProjectBodySchema.parse(req.body);

    const newProject = await prisma.project.create({
      data: { name: body.name, code: body.code },
    });

    res.status(201).json(newProject);
  },
);

export const updateProject = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;
    const body = updateProjectBodySchema.parse(req.body);

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.code !== undefined ? { code: body.code } : {}),
      },
    });

    res.json(updatedProject);
  },
);

export const deleteProject = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const { id } = req.params;

    await prisma.project.delete({ where: { id } });

    res.status(204).send();
  },
);
