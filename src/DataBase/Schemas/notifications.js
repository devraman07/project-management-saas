

import {
  pgTable,
  uuid,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { memberships } from "./membership.js";
import { organizations } from "./organizations.js";
import { activityLogs } from "./activity_logs.js";

export const notifications = pgTable(
  "notifications",
  {

    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    recipientMembershipId: uuid("recipient_membership_id")
      .notNull()
      .references(() => memberships.id, {
        onDelete: "cascade",
      }),

    activityId: uuid("activity_id")
      .notNull()
      .references(() => activityLogs.id, {
        onDelete: "cascade",
      }),

    isRead: boolean("is_read")
      .default(false)
      .notNull(),

    readAt: timestamp("read_at"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

  }
);