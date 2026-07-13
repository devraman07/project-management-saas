import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { notifications } from "../../DataBase/Schemas/notifications.js";

export const notificationRepository = {
  async create(tx = db, data) {
    const [notification] = await tx
      .insert(notifications)
      .values(data)
      .returning();

    return notification;
  },

  async findByReplicant(tx = db, recipientMembershipId) {
    return await tx
      .select()
      .from(notifications)
      .where(eq(notifications.recipientMembershipId, recipientMembershipId))
      .orderBy(desc(notifications.createdAt));
  },

  async markAsRead(tx = db, notificationId) {
    const [notification] = await tx
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(notifications.id, notificationId))
      .returning();
  },

  async markAllAsRead(tx = db, recipientMembershipId) {
    return await tx
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.recipientMembershipId, recipientMembershipId),
          eq(notifications.isRead, false),
        ),
      )
      .returning();
  },

  async delete(tx = db, notificationId) {
    const [notification] = await tx
      .delete(notifications)
      .where(eq(notifications.id, notificationId))
      .returning();

    return notification;
  },

  async countUnread(tx  =db, recipientMembershipId ) {
    const [result] = await tx.select({
        count : sql<Number>`count(*)`
    }).from(notifications).where(
        and(
            eq(notifications.recipientMembershipId, recipientMembershipId),
            eq(notifications.isRead, false)
        )
    );

    return Number(result.count);
  }
};
