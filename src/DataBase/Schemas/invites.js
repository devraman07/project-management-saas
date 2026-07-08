import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { organizations } from "./organizations.js";
import { memberships, membershipRoleEnum } from "./membership.js";

export const inviteStatusEnum = pgEnum("invite_status", [
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
  "REVOKED",
]);

export const invites = pgTable("invites", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  invitedEmail: varchar("invited_email", {
    length: 255,
  }).notNull(),

  roleToAssign: membershipRoleEnum("role_to_assign")
    .notNull(),

  token: text("token")
    .notNull()
    .unique(),

  status: inviteStatusEnum("status")
    .default("PENDING")
    .notNull(),

  invitedBy: uuid("invited_by")
    .references(() => memberships.id, {
      onDelete: "set null",
    }),

  expiresAt: timestamp("expires_at")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});