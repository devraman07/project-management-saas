import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendSuccessResponse } from "../../shared/utils/sendSuccessResponce.js";
import {
  createCommentService,
  deletecommentService,
  getCommentsByTaskService,
  updatecommentService,
} from "./comments.service.js";

export const createCommentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await createCommentService(taskId, req.body, req.user);

  return sendSuccessResponse(res, result);
});

export const getcommentsByTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await getCommentsByTaskService(taskId, req.user.id);

  return sendSuccessResponse(res, result);
});

export const updatecommentController = asyncHandler(async (req, res) => {
  const { taskId, commentId } = req.params;

  const { content } = req.body;

  const result = await updatecommentService(
    req.user.id,
    taskId,
    content,
    commentId,
  );

  return sendSuccessResponse(res, result);
});

export const deletecommentController = asyncHandler(async (req, res) => {
  const { taskId, commentId } = req.params;

  const result = await deletecommentService(req.user.id, taskId, commentId);

  return sendSuccessResponse(res, result);
});
