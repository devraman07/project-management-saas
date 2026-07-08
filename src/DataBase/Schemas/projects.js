import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { organizations } from "./organizations.js";
import { memberships } from "./membership.js";
import { users } from "./users.js";
import { boolean } from "drizzle-orm/gel-core";

export const projectStatusEnum = pgEnum("project_status", [
  "ACTIVE",
  "PLANNING",
  "COMPLETED",
  "ON_HOLD"
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    description: text("description"),

    managerId: uuid("manager_id").references(() => memberships.id, {
      onDelete: "restrict",
    }),

    status: projectStatusEnum("status").default("ACTIVE").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    
    isArchived : boolean("is_archived")
  .default(false)
  .notNull()
    
  },
  (table) => ({
    uniqueProjectName: unique().on(table.organizationId, table.name),
  }),
);
