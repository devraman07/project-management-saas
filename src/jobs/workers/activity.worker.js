import { Worker } from "bullmq"
import { logger } from "../../shared/logger/logger.js"
import { createActivityService } from "../../features/activity/activity.service.js";
import { redisConnection } from "../../configs/redis.js";


export const activityWorker = new Worker("activity", 

    async(job) => {
        logger.info(
            {
                jobId : job.id,
                action : job.name,
            },
            "processing activity job"
        );

        switch (job.name) {
            case "activity-log" : 
            await createActivityService(job.data);
            break;

            default : 
            logger.warn(
                {
                    jobName : job.name,
                }, "unkown activity job"
            );
        }
    },
    {
        connection : redisConnection,
    }
 );


activityWorker.on(
  "completed",
  (job) => {

    logger.info(
      {
        jobId: job.id,
      },
      "Activity job completed"
    );

  }
);


activityWorker.on(
  "failed",
  (job, err) => {

    logger.error(
      {
        jobId: job?.id,
        err,
      },
      "Activity job failed"
    );

  }
);
