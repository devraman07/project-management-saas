import { Queue } from "bullmq";
import { redisConnection } from "../../configs/redis.js";

export const emailQueue = new Queue("email", {
  connection: redisConnection,
});