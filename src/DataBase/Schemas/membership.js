import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  timestamp,
  unique,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { organizations } from "./organizations.js";
import { tasks } from "./tasks.js";
import { attachments } from "./attachments.js";

export const membershipRoleEnum = pgEnum("membership_role", [
  "OWNER",
  "ADMIN",
  "PROJECT_MANAGER",
  "MEMBER",
  "VIEWER",
]);

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    role: membershipRoleEnum("role").notNull(),

    invitedBy: uuid("invited_by"),

    joinedAt: timestamp("joined_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueMembership: unique().on(
      table.userId,
      table.organizationId
    ),

    invitedByFk: foreignKey({
      columns: [table.invitedBy],
      foreignColumns: [table.id],
      name: "memberships_invited_by_fk",
    }).onDelete("set null"),
  })
);

export const membershipRelations = relations(
  memberships,
  ({ one, many }) => ({
    user: one(users, {
      fields: [memberships.userId],
      references: [users.id],
    }),

    organization: one(organizations, {
      fields: [memberships.organizationId],
      references: [organizations.id],
    }),

    inviter: one(memberships, {
      fields: [memberships.invitedBy],
      references: [memberships.id],
      relationName: "membershipInviter",
    }),

    invitedMembers: many(memberships, {
      relationName: "membershipInviter",
    }),

    createdTasks: many(tasks, {
      relationName: "taskCreator",
    }),

    assignedTasks: many(tasks, {
      relationName: "taskAssignee",
    }),

    attachments: many(attachments),
  })
);