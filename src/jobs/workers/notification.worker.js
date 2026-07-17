import { Worker } from "bullmq";

import { redisConnection } from "../../configs/redis.js";
import { logger } from "../../shared/logger/logger.js";
import { createNotificationService } from "../../features/notifications/notification.service.js";

console.log("🔔 Notification Worker Started");

export const notificationWorker = new Worker(
  "notifications",

  async (job) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
      },
      "Processing notification job",
    );

    switch (job.name) {
      case "create-notification":
        await createNotificationService(job.data);
        break;

      default:
        logger.warn(
          {
            jobName: job.name,
          },
          "Unknown notification job",
        );
    }
  },

  {
    connection: redisConnection,
  },
);

notificationWorker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Notification job completed",
  );
});

notificationWorker.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      err,
    },
    "Notification job failed",
  );
});