import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface Task {
  id: number;
  title: string;
  status: "TODO" | "DONE";
}

let tasks: Task[] = [
  { id: 1, title: "Nauczyć się podstaw Expressa", status: "DONE" },
];

app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

app.post("/tasks", (req: Request, res: Response) => {
  const newTask = req.body as Task;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const { title, status } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title ?? tasks[taskIndex].title,
    status: status ?? tasks[taskIndex].status,
  };

  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id as string);

  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
