import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { title, status } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        status,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found or update failed" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
};
