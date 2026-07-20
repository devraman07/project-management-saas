import { sql } from "drizzle-orm";

import { pgTable, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { comments } from "./comments.js";
import { memberships } from "./membership.js";

export const mentions = pgTable("mentions", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  commentId: uuid("comment_id")
    .notNull()
    .references(() => comments.id, {
      onDelete: "cascade",
    }),

  mentionedMembershipId: uuid("mentioned_membership_id")
    .notNull()
    .references(() => memberships.id, {
      onDelete: "cascade",
    }),

  mentionedByMembershipId: uuid("mentioned_by_membership_id")
    .notNull()
    .references(() => memberships.id, {
      onDelete: "cascade",
    }),

  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
