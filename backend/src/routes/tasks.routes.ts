import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller";
import { validate } from "../middleware/validate.middleware";
import {
  idParamSchema,
  listQueryRequestSchema,
} from "../validation/common.schema";
import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
} from "../validation/tasks.schema";

const router = Router();

router.get("/", validate(listQueryRequestSchema), getAllTasks);
router.get("/:id", validate(idParamSchema), getTaskById);

router.post("/", validate(createTaskRequestSchema), createTask);
router.patch("/:id", validate(updateTaskRequestSchema), updateTask);
router.delete("/:id", validate(idParamSchema), deleteTask);

export default router;
