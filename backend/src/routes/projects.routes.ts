import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/projects.controller";
import { validate } from "../middleware/validate.middleware";
import { idParamSchema } from "../validation/common.schema";
import { getTasksByProjectId } from "../controllers/tasks.controller";

const router = Router();

router.get("/", getAllProjects);
router.get("/:id", validate(idParamSchema), getProjectById);
router.get("/:id/tasks", validate(idParamSchema), getTasksByProjectId);

router.post("/", createProject);
router.patch("/:id", validate(idParamSchema), updateProject);
router.delete("/:id", validate(idParamSchema), deleteProject);

export default router;
