import { Queue } from "bullmq";
import { redisConnection } from "../../configs/redis.js";



export const notificationQueue = new Queue("notifications", {
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