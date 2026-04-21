import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/projects.controller";
import { validate } from "../middleware/validate.middleware";
import {
  idParamSchema,
  listQueryRequestSchema,
} from "../validation/common.schema";
import {
  createProjectRequestSchema,
  updateProjectRequestSchema,
} from "../validation/projects.schema";
import { getTasksByProjectId } from "../controllers/tasks.controller";

const router = Router();

router.get("/", validate(listQueryRequestSchema), getAllProjects);
router.get("/:id", validate(idParamSchema), getProjectById);
router.get("/:id/tasks", validate(idParamSchema), getTasksByProjectId);

router.post("/", validate(createProjectRequestSchema), createProject);
router.patch("/:id", validate(updateProjectRequestSchema), updateProject);
router.delete("/:id", validate(idParamSchema), deleteProject);

export default router;
