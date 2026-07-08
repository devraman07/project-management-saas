import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";
import { boolean } from "drizzle-orm/gel-core";

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
