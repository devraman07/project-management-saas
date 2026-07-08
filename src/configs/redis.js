import Redis from "ioredis";
import { logger } from "../shared/logger/logger.js";


export const redisConnection = new Redis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
})

redisConnection.on("connect", () => {
    logger.info("connected to redis-server");
});


redisConnection.on("error", (err) => {
    logger.warn("redis connection error", err);
});