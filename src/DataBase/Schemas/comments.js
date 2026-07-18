import { sql } from "drizzle-orm";
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { tasks } from "./tasks.js";
import { memberships } from "./membership.js";

export const comments = pgTable("comments", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, {
      onDelete: "cascade",
    }),

  membershipId: uuid("membership_id")
    .notNull()
    .references(() => memberships.id),

  parentCommentId: uuid("parent_comment_id").references(() => comments.id),

  content: text("content").notNull(),

  edited: boolean("edited").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  deletedAt: timestamp("deleted_at"),
});
