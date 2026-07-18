// create()
// findById()
// findAllByTask()
// update()
// softDelete()
// restore()      // optional, useful later
// hardDelete()   // internal/admin only

import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { comments } from "../../DataBase/Schemas/comments.js";

export const commentsRepo = {
  async createComment(tx = db, data) {
    const [newComment] = await tx.insert(comments).values(data).returning();

    return newComment;
  },

  async findById(tx = db, commentId) {
    const [comment] = await tx
      .select()
      .from(comments)
      .where(eq(comments.id, commentId));

    return comment;
  },

  async findByTask(tx = db, taskId, limit = 20, offset = 0) {
    return await tx
      .select()
      .from(comments)
      .where(and(eq(comments.taskId, taskId), isNull(comments.deletedAt)))
      .orderBy(asc(comments.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async update(tx = db, commentId, updates) {
    const [updatedComment] = await tx
      .update(comments)
      .set({
        ...updates,
        edited: true,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return updatedComment;
  },

  async softDelete(tx = db, commentId) {
    const [deletedComment] = await tx
      .update(comments)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return deletedComment;
  },

  async hardDelete(tx = db, commentsId) {
    return await tx.delete(comments).where(eq(comments.id, commentsId));
  },
};
