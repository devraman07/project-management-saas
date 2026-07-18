import { commentsRepo } from "../../features/comments/comments.repository.js";
import { getTaskFromMembership } from "./getMembershipFromTask.js";

export const getCommentContext = async (
    userId,
    taskId,
    commentId
) => {

    const comment =
        await commentsRepo.findById(
            undefined,
            commentId
        );

    if (!comment) {
        throw new NotFoundError(
            "Comment not found"
        );
    }

    const {
        membership,
        project,
        task
    } = await getTaskFromMembership(
        userId,
        taskId
    );

    return {
        comment,
        membership,
        project,
        task
    };
};