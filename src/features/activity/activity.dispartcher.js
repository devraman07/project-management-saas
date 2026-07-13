import { notify } from "../../shared/utils/notify.js";

export const dispatchActivity = async (activity) => {
  switch (activity.action) {
    case "TASK_ASSIGNED":
      await notify({
        organizationId: activity.organizationId,
        recipientMembershipId:
          activity.metadata.assignedMembershipId,
        activityId: activity.id,
      });
      break;

    default:
      break;
  }
};