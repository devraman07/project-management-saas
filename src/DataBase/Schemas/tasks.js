import { relations, sql } from "drizzle-orm";

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  date,
  index,
} from "drizzle-orm/pg-core";

import { projects } from "./projects.js";
import { memberships } from "./membership.js";
import { attachments } from "./attachments.js";

export const taskStatusEnum = pgEnum("task_status", [
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "BLOCKED",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    description: text("description"),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => memberships.id, {
        onDelete: "restrict",
      }),

    assignedTo: uuid("assigned_to").references(
      () => memberships.id,
      {
        onDelete: "set null",
      }
    ),

    status: taskStatusEnum("status")
      .default("TODO")
      .notNull(),

    priority: taskPriorityEnum("priority")
      .default("MEDIUM")
      .notNull(),

    dueDate: date("due_date"),

    isArchived: boolean("is_archived")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    projectIdx: index("tasks_project_idx").on(
      table.projectId
    ),

    statusIdx: index("tasks_status_idx").on(
      table.status
    ),

    assigneeIdx: index("tasks_assignee_idx").on(
      table.assignedTo
    ),
  })
);

export const taskRelations = relations(
  tasks,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [tasks.projectId],
      references: [projects.id],
    }),

    creator: one(memberships, {
      fields: [tasks.createdBy],
      references: [memberships.id],
      relationName: "taskCreator",
    }),

    assignee: one(memberships, {
      fields: [tasks.assignedTo],
      references: [memberships.id],
      relationName: "taskAssignee",
    }),

    attachments: many(attachments),
  })
);