import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { memberships } from "./membership.js";

export const attachments = pgTable(
  "attachments",
  {
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
      .references(() => memberships.id, {
        onDelete: "cascade",
      }),

    originalName: text("original_name").notNull(),

    fileName: text("file_name").notNull(),

    mimeType: text("mime_type").notNull(),

    fileSize: integer("file_size").notNull(),

    storageKey: text("storage_key").notNull(),

    url: text("url").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),

    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    taskIdx: index("attachments_task_idx").on(table.taskId),

    taskDeletedIdx: index("attachments_task_deleted_idx").on(
      table.taskId,
      table.deletedAt
    ),

    uploaderIdx: index("attachments_membership_idx").on(
      table.membershipId
    ),
  })
);

export const attachmentRelations = relations(
  attachments,
  ({ one }) => ({
    task: one(tasks, {
      fields: [attachments.taskId],
      references: [tasks.id],
    }),

    uploader: one(memberships, {
      fields: [attachments.membershipId],
      references: [memberships.id],
    }),
  })
);