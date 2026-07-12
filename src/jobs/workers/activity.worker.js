import { Worker } from "bullmq";
import { logger } from "../../shared/logger/logger.js";
import { createActivityService } from "../../features/activity/activity.service.js";
import { redisConnection } from "../../configs/redis.js";

console.log("🚀 Activity Worker Started");

export const activityWorker = new Worker(
  "activity",
  async (job) => {
    try {
      logger.info(
        {
          jobId: job.id,
          action: job.name,
        },
        "Processing activity job"
      );

      switch (job.name) {
        case "activity-log":
          await createActivityService(job.data);
          break;

        default:
          logger.warn(
            {
              jobName: job.name,
            },
            "Unknown activity job"
          );
      }
    } catch (err) {
      console.error("🔥 Worker Error:", err);
      throw err; 
    }
  },
  {
    connection: redisConnection,
  }
);