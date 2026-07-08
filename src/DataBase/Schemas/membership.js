import {
  pgTable,
  uuid,
  timestamp,
  unique,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./users.js";
import { organizations } from "./organizations.js";


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

    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    
  },
  (table) => ({
    uniqueMembership: unique().on(table.userId, table.organizationId),

    invitedByFk: foreignKey({
  columns: [table.invitedBy],
  foreignColumns: [users.id],
  name: "memberships_invited_by_fk",
}).onDelete("set null"),
  }),
);
