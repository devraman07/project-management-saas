import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { logger } from "../shared/logger/logger.js";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

 export const db = drizzle(pool);
logger.info("database connected successfully");
