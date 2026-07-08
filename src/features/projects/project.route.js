import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";

import {
    archiveprojectController,
  getSingleProjectController,
  updateProjectController,
  updateProjectStatusController,
} from "./project.controller.js";

import { updateProjectValidator } from "./project.validator.js";
import { projectTaskRouter } from "../tasks/ProjectTask.route.js";

export const projectRouter = express.Router();

projectRouter.get("/:projectId", authMiddleware, getSingleProjectController);

projectRouter.patch(
  "/:projectId",
  authMiddleware,
  updateProjectValidator,
  updateProjectController,
);

projectRouter.patch(
  "/:projectId/status",
  authMiddleware,
  updateProjectStatusController
);
projectRouter.delete(
  "/:projectId",
  authMiddleware,
  archiveprojectController
);

projectRouter.use("/:projectId", projectTaskRouter);
