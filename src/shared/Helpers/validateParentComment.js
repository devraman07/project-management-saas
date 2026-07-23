import { commentsRepo } from "../../features/comments/comments.repository.js";

export const validateParentComment = async (
  taskId,
  parentCommentId
) => {
  if (!parentCommentId) return;

  const parentComment = await commentsRepo.findById(
    undefined,
    parentCommentId
  );

  if (!parentComment) {
    throw new NotFoundError("Parent comment not found.");
  }

  if (parentComment.deletedAt) {
    throw new ValidationError(
      "Cannot reply to a deleted comment."
    );
  }

  if (parentComment.taskId !== taskId) {
    throw new ValidationError(
      "Parent comment does not belong to this task."
    );
  }
};