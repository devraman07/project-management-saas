import { Queue } from "bullmq";
import { redisConnection } from "../../configs/redis.js";


export const activityQueue = new Queue("activity-logs", {
    connection : redisConnection,

    defaultJobOptions : {
        removeOnComplete : 100,
        removeOnFail : 100,
        attempts : 3,
        backoff : {
            type : "exponential",
            delay : 1000,
        },
    },
});