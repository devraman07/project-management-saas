import { getTaskFromMembership } from "../../shared/Helpers/getMembershipFromTask.js";
import { extractMentions } from "../../shared/utils/mentions.utils.js";
import { commentsRepo } from "../comments/comments.repository.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { mentionsRepo } from "./mentions.repository.js";

export const createMentionsfromComment = async ({ user, comment }) => {
  const { membership } = await getTaskFromMembership(user.id, comment.taskId);

  const usernames = extractMentions(comment.content);

  if (usernames.length === 0) {
    return [];
  }

  const uniqueUsernames = [...new Set(usernames)];

  const mentionedMemberships = await mentionsRepo.findByUsernamesAndOrganizaion(
    undefined,
    uniqueUsernames,
    membership.organizationId,
  );

  console.log(mentionedMemberships);
  console.log(Array.isArray(mentionedMemberships));

  const validmentions = mentionedMemberships.filter(
    (member) => member.id !== membership.userId,
  );

  if (validmentions.length === 0) {
    return [];
  }

  const mentionRecords = validmentions.map((member) => ({
    commentId: comment.id,
    mentionedMembershipId: member.id,
    mentionedByMembershipId: membership.id,
  }));

  const mentions = mentionsRepo.createMany(undefined, mentionRecords);

  return  mentions;
  
};
