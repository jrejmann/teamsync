import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller";
import { validate } from "../middleware/validate.middleware";
import { idParamSchema } from "../validation/common.schema";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", validate(idParamSchema), getTaskById);

router.post("/", createTask);
router.patch("/:id", validate(idParamSchema), updateTask);
router.delete("/:id", validate(idParamSchema), deleteTask);

export default router;
