import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { organizations } from "./organizations.js";
import { memberships } from "./membership.js";

export const activityActionEnum = pgEnum("activity_action", [
  "ORGANIZATION_CREATED",

  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_ARCHIVED",

  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_ASSIGNED",
  "TASK_COMPLETED",

  "INVITE_SENT",
  "INVITE_ACCEPTED",

  "MEMBER_ADDED",
  "MEMBER_REMOVED",
  "ROLE_CHANGED",
]);

export const entityTypeEnum = pgEnum("entity_type", [
  "ORGANIZATION",

  "PROJECT",

  "TASK",

  "MEMBERSHIP",

  "INVITE",
]);

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  actorMembershipId: uuid("actor_membership_id").references(
    () => memberships.id,
    {
      onDelete: "set null",
    },
  ),

  action: activityActionEnum("action").notNull(),

  entityType: entityTypeEnum("entity_type").notNull(),

  entityId: uuid("entity_id").notNull(),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
