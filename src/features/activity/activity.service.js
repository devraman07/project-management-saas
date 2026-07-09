import { ValidationError } from "../../errors/ValidationError.js";
import { logger } from "../../shared/logger/logger.js";
import { activityRepository } from "./activity.repository.js";


export const createActivityService = async({
    organizationId, 
    actorMembershipId,
    action,
    entityType,
    entityId,
    metadata = {}
}) => {

      if (!organizationId) {
    throw new ValidationError(
        "Organization id is required"
    );
}

if (!action) {
    throw new ValidationError(
        "Activity action is required"
    );
}

if (!entityType) {
    throw new ValidationError(
        "Entity type is required"
    );
}

if (!entityId) {
    throw new ValidationError(
        "Entity id is required"
    );
}


     const activity = await activityRepository.create(undefined, {
        organizationId : organizationId, actorMembershipId : actorMembershipId,
        action : action,  entityType : entityType,
        entityId : entityId, metadata : metadata
     });

   
     logger.info({
        activityId : activity.id,
        organizationId,
        action,
        entityId,
        entityType
     }, "activity created");

     return {
        activity : activity,
        
     }

}