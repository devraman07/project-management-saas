import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendSuccessResponse } from "../../shared/utils/sendSuccessResponce.js";
import { createCommentService, deletecommentService, getRepliesService, updatecommentService } from "../comments/comments.service.js";



export const createReplyController = asyncHandler(
  async (req, res) => {
    const { taskId, commentId } = req.params;

    const result = await createCommentService(
      taskId,
      {
        content: req.body.content,
        parentCommentId: commentId,
      },
      req.user
    );

    return sendSuccessResponse(res, result);
  }
);


export const getRepliesController = asyncHandler(
  async (req, res) => {
    const { taskId, commentId } = req.params;

    const result = await getRepliesService(
      taskId,
      commentId,
      req.user
    );

    return sendSuccessResponse(res, result);
  }
);

export const updateReplyController = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  const result = await updatecommentService(
    replyId,
    req.body,
    req.user,
    {
      expectReply: true,
    }
  );

  return sendSuccessResponse(res, result);
});

export const deleteReplyController = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  const result = await deletecommentService(
    replyId,
    req.user,
    {
      expectReply: true,
    }
  );

  return sendSuccessResponse(res, result);
});