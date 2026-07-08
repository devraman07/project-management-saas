// GET    /tasks/:taskId
// PATCH  /tasks/:taskId
// PATCH  /tasks/:taskId/status
// PATCH  /tasks/:taskId/assign
// DELETE /tasks/:taskId

import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { assignTaskController, deleteTaskController, getSingleTaskController, updateTaskController, updateTaskStatusController } from "./task.controller.js";

export const taskRouter = express.Router();

taskRouter.get(
  "/:taskId",
  authMiddleware,
  getSingleTaskController
);

taskRouter.patch(
  "/:taskId",
  authMiddleware,
  updateTaskController
);

taskRouter.patch(
  "/:taskId/status",
  authMiddleware,
  updateTaskStatusController
);

taskRouter.patch(
  "/:taskId/assign",
  authMiddleware,
  assignTaskController
);

taskRouter.delete(
  "/:taskId",
  authMiddleware,
  deleteTaskController
);