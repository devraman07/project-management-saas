import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./users.js";

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  tokenHash: text("token_hash")
    .notNull(),

  isRevoked: boolean("is_revoked")
    .default(false)
    .notNull(),

  expiresAt: timestamp("expires_at")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});