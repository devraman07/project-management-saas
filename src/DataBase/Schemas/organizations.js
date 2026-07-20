import { pgTable, uuid, varchar, timestamp, unique, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users.js";


export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    isDeleted: boolean("is_deleted").default(false).notNull(),

    deletedAt: timestamp("deleted_at"),
  },

  (table) => ({
    uniqueOrgPerUser: unique().on(table.createdBy, table.name),
  }),
);

export const organizationRelations = relations(
  organizations,
  ({ many }) => ({
    memberships: many(memberships),

    projects: many(projects),

    activityLogs: many(activityLogs),
  })
);
