import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { attachments } from "../../DataBase/Schemas/attachments.js";

export const attachmentsRepo = {
  async create(tx = db, data) {
    const [attachment] = await tx.insert(attachments).values(data).returning();

    return attachment;
  },

  async findById(tx = db, attachmentId) {
    const [attachment] = await tx
      .select()
      .from(attachments)
      .where(
        and(eq(attachments.id, attachmentId), isNull(attachments.deletedAt)),
      );
    return attachment;
  },

  async findByTask(tx = db, taskId, limit = 20, offset = 0) {
    return await tx
      .select()
      .from(attachments)
      .where(and(eq(attachments.taskId, taskId), isNull(attachments.deletedAt)))
      .orderBy(desc(attachments.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async softDelete(tx = db, attachmentId) {
    const [attachment] = await tx
      .update(attachments)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(attachments.id, attachmentId))
      .returning();

    return attachment;
  },
};
