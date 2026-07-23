import { logActivity } from "../utils/activity/Logger.js";

export const createCommentActivity = async ({
  comment,
  membership,
  project,
}) => {
  await logActivity({
    organizationId: project.organizationId,

    actorMembershipId: membership.id,

    action: "COMMENT_CREATED",

    entityType: "COMMENT",

    entityId: comment.id,

    metadata: {
      taskId: comment.taskId,
      parentCommentId: comment.parentCommentId,
      commentPreview: comment.content.substring(0, 100),
    },
  });
};