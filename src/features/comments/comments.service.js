import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { createCommentActivity } from "../../shared/Helpers/createCommentActivity.js";
import { getCommentContext } from "../../shared/Helpers/getCommentContext.js";
import { getTaskFromMembership } from "../../shared/Helpers/getMembershipFromTask.js";
import { processCommentMentions } from "../../shared/Helpers/processMentions.js";
import { validateParentComment } from "../../shared/Helpers/validateParentComment.js";
import { logger } from "../../shared/logger/logger.js";
import { logActivity } from "../../shared/utils/activity/Logger.js";
import { hasMentions } from "../../shared/utils/mentions.utils.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { createMentionsfromComment } from "../mentions/mentions.service.js";
import { ProjectRepo } from "../projects/project.repository.js";
import { taskRepo } from "../tasks/task.repository.js";
import { commentsRepo } from "./comments.repository.js";

export const createCommentService = async (taskId, commentData, user) => {
  const { task, project, membership } = await getTaskFromMembership(
    user.id,
    taskId,
  );

  await validateParentComment(taskId, commentData.parentCommentId);

  const comment = await commentsRepo.createComment(undefined, {
    taskId,
    membershipId: membership.id,
    parentCommentId: commentData.parentCommentId ?? null,
    content: commentData.content,
  });

  await processCommentMentions({
    user,
    comment,
    membership,
    project,
  });

  await createCommentActivity({
    comment,
    membership,
    project,
  });

  return {
    success: true,
    statusCode: 201,
    message: comment.parentCommentId
      ? "Reply created successfully."
      : "Comment created successfully.",
    comment,
  };
};

export const getCommentsByTaskService = async (taskId, userId) => {
  const { task, project, membership } = await getTaskFromMembership(
    userId,
    taskId,
  );

  const comments = await commentsRepo.findByTask(undefined, taskId);

  logger.info(
    {
      taskId: taskId,
      membershipId: membership.id,
    },
    "comments fetched successfully",
  );

  return {
    success: true,
    statusCode: 200,
    data: comments,
    message: "comments fetched successfully",
  };
};

export const updatecommentService = async (
  userId,
  taskId,
  content,
  commentId,
) => {
  const { comment, membership, project } = await getCommentContext(
    userId,
    taskId,
    commentId,
  );

  let updatedComment;

  if (
    membership.id === comment.membershipId ||
    membership.role === "OWNER" ||
    membership.role === "ADMIN"
  ) {
    updatedComment = await commentsRepo.update(undefined, commentId, {
      content,
    });
  } else {
    throw new AuthorizationError("not allowed to update comment");
  }

  await logActivity({
    organizationId: project.organizationId,

    actorMembershipId: membership.id,

    action: "COMMENT_UPDATED",

    entityType: "COMMENT",

    entityId: comment.id,

    metadata: {
      taskId,
      commentPreview: updatedComment.content.substring(0, 100),
    },
  });

  return {
    success: true,
    statusCode: 200,
    data: updatedComment,
    message: "comment updated successfully",
  };
};

export const deletecommentService = async (userId, taskId, commentId) => {
  const { comment, membership, project } = await getCommentContext(
    userId,
    taskId,
    commentId,
  );
  let deletedComment;

  if (
    comment.membershipId !== membership.id &&
    membership.role !== "OWNER" &&
    membership.role !== "ADMIN"
  ) {
    throw new AuthorizationError("Not allowed to delete this comment.");
  } else {
    deletedComment = await commentsRepo.softDelete(undefined, commentId);
  }

  await logActivity({
    organizationId: project.organizationId,

    actorMembershipId: membership.id,

    action: "COMMENT_DELETED",

    entityType: "COMMENT",

    entityId: comment.id,

    metadata: {
      taskId,
      commentPreview: deletedComment.content.substring(0, 100),
    },
  });

  return {
    success: true,
    statusCode: 200,
    data: deletedComment,
    message: "comment deleted successfully",
  };
};

export const getRepliesService = async (taskId, parentCommentId, user) => {
  const { membership } = await getTaskFromMembership(user.id, taskId);

  const parentComment = await commentsRepo.findById(undefined, parentCommentId);

  if (!parentComment) {
    throw new NotFoundError("Parent comment not found.");
  }

  if (parentComment.deletedAt) {
    throw new ValidationError("Parent comment has been deleted.");
  }

  if (parentComment.taskId !== taskId) {
    throw new ValidationError("Comment does not belong to this task.");
  }

  const replies = await commentsRepo.findRepliesByParentCommentId(
    undefined,
    parentCommentId,
  );

  return {
    success: true,
    statusCode: 200,
    message: "Replies retrieved successfully.",
    data: replies,
  };
};
