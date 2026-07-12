import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  assignTaskService,
  createTaskService,
  getProjectTasksService,
  getSingleTaskService,
  updateTaskService,
  updateTaskStatusService,
} from "./task.service.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const taskData = req.body;

  const result = await createTaskService(projectId, taskData, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    task: result.task,
    message: result.message,
  });
});

export const getProjectTasksController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await getProjectTasksService(projectId, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    tasks: result.tasks,
    message: result.message,
  });
});

export const getSingleTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await getSingleTaskService(taskId, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    task: result.task,
    message: result.message,
  });
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const updateData = req.body;

  const result = await updateTaskService(taskId, updateData, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    task: result.task,
    message: result.message,
  });
});

export const updateTaskStatusController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const { status } = req.body;

  const result = await updateTaskStatusService(taskId, status, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    task: result.task,
    message: result.message,
  });
});

export const assignTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const { membershipId } = req.body;

  const result = await assignTaskService(taskId, membershipId, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    task: result.task,
    message: result.message,
  });
});

export const deleteTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await deleteTaskService(taskId, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});
