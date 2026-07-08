// POST   /projects/:projectId/tasks
// GET    /projects/:projectId/tasks

import express from "express";
import { createTaskController, getProjectTasksController } from "./task.controller.js";
import { authMiddleware } from "../../middlewares/auth.middileware.js";

export const projectTaskRouter = express.Router({
  mergeParams: true,
});

projectTaskRouter.post("/tasks", authMiddleware, createTaskController);

projectTaskRouter.get("/tasks", authMiddleware, getProjectTasksController);
