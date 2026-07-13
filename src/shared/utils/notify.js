import { notificationQueue } from "../../jobs/queues/notification.queue.js";

export const notify = async (notificationData) => {
  await notificationQueue.add(
    "create-notification",
    notificationData,
  );
};