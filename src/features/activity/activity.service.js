import { ValidationError } from "../../errors/ValidationError.js";
import { logger } from "../../shared/logger/logger.js";
import { dispatchActivity } from "./activity.dispartcher.js";
import { activityRepository } from "./activity.repository.js";

export const createActivityService = async ({
  organizationId,
  actorMembershipId,
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  if (!organizationId) {
    throw new ValidationError("Organization id is required");
  }

  if (!action) {
    throw new ValidationError("Activity action is required");
  }

  if (!entityType) {
    throw new ValidationError("Entity type is required");
  }

  if (!entityId) {
    throw new ValidationError("Entity id is required");
  }
  console.log("1. Validation passed");

  const activity = await activityRepository.create(undefined, {
    organizationId: organizationId,
    actorMembershipId: actorMembershipId,
    action: action,
    entityType: entityType,
    entityId: entityId,
    metadata: metadata,
  });

  console.log("2. Activity inserted:", activity);

  await dispatchActivity(activity);

  console.log("3. Dispatch completed");


  logger.info(
    {
      activityId: activity.id,
      organizationId,
      action,
      entityId,
      entityType,
    },
    "activity created",
  );

  console.log("4. Service finished");

  return {
    activity: activity,
  };
};
