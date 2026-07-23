import { createMentionsfromComment } from "../../features/mentions/mentions.service.js";
import { logActivity } from "../utils/activity/Logger.js";
import { hasMentions } from "../utils/mentions.utils.js";


export const processCommentMentions = async ({
  user,
  comment,
  membership,
  project,
}) => {
  if (!hasMentions(comment.content)) return;

  const createdMentions =
    await createMentionsfromComment({
      user,
      comment,
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
          mentionedMembershipId:
            mention.mentionedMembershipId,
          commentId: comment.id,
        },
      },
    });
  }
};