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
import {
  createComment,
  deleteComment,
  getCommentsByTaskId,
  updateComment,
} from "../controllers/comments.controller";
import {
  createCommentRequestSchema as createCommentReq,
  taskCommentParamSchema,
  taskIdParamSchema,
  updateCommentRequestSchema,
} from "../validation/comments.schema";

const router = Router();

router.get("/", validate(listQueryRequestSchema), getAllTasks);

router.get(
  "/:taskId/comments",
  validate(taskIdParamSchema),
  getCommentsByTaskId,
);
router.post(
  "/:taskId/comments",
  validate(createCommentReq),
  createComment,
);
router.patch(
  "/:taskId/comments/:commentId",
  validate(updateCommentRequestSchema),
  updateComment,
);
router.delete(
  "/:taskId/comments/:commentId",
  validate(taskCommentParamSchema),
  deleteComment,
);

router.get("/:id", validate(idParamSchema), getTaskById);

router.post("/", validate(createTaskRequestSchema), createTask);
router.patch("/:id", validate(updateTaskRequestSchema), updateTask);
router.delete("/:id", validate(idParamSchema), deleteTask);

export default router;
