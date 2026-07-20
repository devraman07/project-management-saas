import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { getCommentContext } from "../../shared/Helpers/getCommentContext.js";
import { getTaskFromMembership } from "../../shared/Helpers/getMembershipFromTask.js";
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
  if (commentData.parentCommentId) {
    const parentComment = await commentsRepo.findById(
      undefined,
      commentData.parentCommentId,
    );

    if (!parentComment) {
      throw new NotFoundError("Parent comment not found");
    }

    if (parentComment.taskId !== taskId) {
      throw new ValidationError("Parent comment does not belong to this task.");
    }
  }

  const comment = await commentsRepo.createComment(undefined, {
    taskId,
    membershipId: membership.id,
    parentCommentId: commentData.parentCommentId,
    content: commentData.content,
  });

  if (hasMentions(comment.content)) {
    const createdMentions = await createMentionsfromComment({
     user, comment
    });

    for (const mention of createdMentions) {
      await logActivity({
        action: "MENTIONS_CREATED",
        entityType: "MENTION",
        entityId: mention.id,
        actorMembershipId: membership.id,
        organizationId: membership.organizationId,
        projectId: project.id,
        taskId: comment.taskId,
        metadata: {
          mention: {
            id: mention.id,
            mentionedMembershipId: mention.mentionedMembershipId,
            commentId: comment.id,
          },
        },
      });
    }
  }

  await logActivity({
    organizationId: project.organizationId,

    actorMembershipId: membership.id,

    action: "COMMENT_CREATED",

    entityType: "COMMENT",

    entityId: comment.id,

    metadata: {
      taskId,
      commentPreview: comment.content.substring(0, 100),
    },
  });

  return {
    success: true,
    statusCode: 201,
    message: "Comment created successfully.",
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
    comments: comments,
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
    comment: updatedComment,
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
    comment: deletedComment,
    message: "comment deleted successfully",
  };
};
