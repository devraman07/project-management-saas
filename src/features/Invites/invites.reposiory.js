import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { invites } from "../../DataBase/Schemas/invites.js";

export const InviteRepo = {
  async create(executor = db, inviteData) {
    const [newInvite] = await executor
      .insert(invites)
      .values(inviteData)
      .returning();

    return newInvite;
  },

  async findPendingByEmailAndOrg(executor = db, email, organizationId) {
    const existingInvite = await executor
      .select()
      .from(invites)
      .where(
        and(
          eq(invites.invitedEmail, email),
          eq(invites.organizationId, organizationId),
          eq(invites.status, "PENDING"),
        ),
      );

    return existingInvite[0];
  },

  async findByToken(executor = db, token) {
    const inviteToken = await executor.select()
    .from(invites).where(
      eq(invites.token, token)
    );

    return inviteToken[0];
  },

  async updateStatus(executor = db, inviteId, status) {
  const [updatedInvite] = await executor
    .update(invites)
    .set({
      status,
    })
    .where(eq(invites.id, inviteId))
    .returning();

  return updatedInvite;
}

};
