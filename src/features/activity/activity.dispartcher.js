import { notify } from "../../shared/utils/notify.js";

export const dispatchActivity = async (activity) => {
  console.log("Dispatcher received:", activity);

  switch (activity.action) {
    case "TASK_ASSIGNED":
      console.log("Creating notification...");

      await notify({
        organizationId: activity.organizationId,
        recipientMembershipId: activity.metadata.assignedMembershipId,
        activityId: activity.id,
      });

      console.log("Notification queued");

      break;

    default:
      break;
  }
};
