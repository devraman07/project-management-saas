import { and, eq } from "drizzle-orm";
import { db } from "../../DataBase/db.js";
import { memberships } from "../../DataBase/Schemas/membership.js";
import { users } from "../../DataBase/Schemas/users.js";
import { organizations } from "../../DataBase/Schemas/organizations.js";

export const membershipRepo = {
  async createMembership(executor = db, membershipData) {
    const [newMembership] = await executor
      .insert(memberships)
      .values(membershipData)
      .returning();

    return newMembership;
  },

  async findAllByUserAndOrg(executor = db, userId, organizationId) {
    const membership = await executor
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.organizationId, organizationId),
        ),
      );

    return membership[0];
  },

  async findById(executor = db, membershipId) {
    const membership = await executor
      .select()
      .from(memberships)
      .where(eq(memberships.id, membershipId));

    return membership[0];
  },

  async findAllByOrg(executor = db, orgId) {
    const membership = await executor
      .select({
        membershipId: memberships.id,
        userId: memberships.userId,
        role: memberships.role,
        joinedAt: memberships.joinedAt,
        name: users.name,
        email: users.email,
      })
      .from(memberships)
      .innerJoin(users, eq(memberships.userId, users.id))
      .where(eq(memberships.organizationId, orgId));

    return membership;
  },

  async delete(executor = db, membershipId) {
    const [deletedMembership] = await executor
      .delete(memberships)
      .where(eq(memberships.id, membershipId))
      .returning();

    return deletedMembership;
  },

  async findByUser(executor = db, id) {
    const userMemberships = await executor
      .select({
        orgName: organizations.name,
        orgId: organizations.id,
        role: memberships.role,
        joinedAt: memberships.joinedAt,
      })
      .from(memberships)
      .innerJoin(
        organizations,
        eq(memberships.organizationId, organizations.id),
      )
      .where(eq(memberships.userId, id));

    return userMemberships;
  },

  async updateRole(executor = db, membershipId, role) {
    const [updatedMembership] = await executor
      .update(memberships)
      .set({ role })
      .where(eq(memberships.id, membershipId))
      .returning();

    return updatedMembership;
  },
};
