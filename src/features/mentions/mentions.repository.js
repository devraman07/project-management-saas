import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { mentions } from "../../DataBase/Schemas/mentions.js";
import { memberships } from "../../DataBase/Schemas/membership.js";
import { users } from "../../DataBase/Schemas/users.js";

export const mentionsRepo = {
  

async createMany(tx = db, data) {
    const createdMentions = await tx
        .insert(mentions)
        .values(data)
        .returning();

    return createdMentions;
},

  async findByMembership(tx = db, membershipId) {
    const [membership] = await tx
      .select()
      .from(mentions)
      .where(and(mentions.mentionedMembershipId, membershipId))
      .orderBy(mentions.createdAt);

    return membership;
  },
  async findById(tx = db, mentionId) {
    const [mentions] = await tx
      .select()
      .from(mentions)
      .where(eq(mentions.id, mentionId));

    return mentions;
  },

  async markAllRead(tx = db, membershipId) {
    const [mentions] = await tx
      .update(mentions)
      .set({
        isRead: true,
      })
      .where(eq(mentions.commentId, commentId), eq(mentions.isRead, false))
      .returning();

    return mentions;
  },

  async findByUsernamesAndOrganizaion(tx = db, usernames, organizationId) {
    return await tx
      .select({
        id: memberships.id,
        userId: memberships.userId,
        organizationId: memberships.organizationId,
        role: memberships.role,
        username: users.username,
      })
      .from(memberships)
      .innerJoin(users, eq(memberships.userId, users.id))
      .where(
        and(
          eq(memberships.organizationId, organizationId),
          inArray(users.username, usernames),
        ),
      );
  },
};
