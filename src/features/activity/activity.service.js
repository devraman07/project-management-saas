import { ValidationError } from "../../errors/ValidationError.js";
import { logger } from "../../shared/logger/logger.js";
import { dispatchActivity } from "./activity.dispartcher.js";
import { activityRepository } from "./activity.repository.js";

export const createActivityService = async ({
  organizationId,
  actorMembershipId,
  membershipId,
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  const actorId = actorMembershipId ?? membershipId;

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
    organizationId,
    actorMembershipId: actorId,
    action,
    entityType,
    entityId,
    metadata,
  });

  console.log("2. Activity inserted:", activity);

  await dispatchActivity(activity);

  console.log("3. Dispatch completed");

  logger.info(
    {
      activityId: activity.id,
      organizationId,
      actorMembershipId: actorId,
      action,
      entityId,
      entityType,
    },
    "activity created",
  );

  console.log("4. Service finished");

  return {
    activity,
  };
};