
import { ValidationError } from "../../errors/ValidationError.js"
import { notificationRepository } from "./notification.repository.js";
import { logger } from "../../shared/logger/logger.js";




export const createNotificationService = async ({
    organizationId, recipientMembershipId, activityId
}) => {
    if(!organizationId) {
        throw new ValidationError("organization id is required");
    }
    if(recipientMembershipId) {
        throw new ValidationError("recipient membership is required");
    }
    if(!activityId) {
        throw new ValidationError("activity id is required")
    }
  
    const notification = notificationRepository.create(undefined, {
        organizationId, recipientMembershipId, activityId
    });

    logger.info(
    {
      notificationId: notification.id,
      recipientMembershipId,
      activityId,
    },
    "Notification created"
  );

  return notification;

}

export const getNotificationsService = async (recipientMembershipId)=> {
     
    if(!recipientMembershipId) {
        throw new ValidationError("recipient membership is required");
    }

    const notifications = await notificationRepository.findByReplicant(undefined, recipientMembershipId);

    logger.info(
       {
         recipientMembershipId : recipientMembershipId
       },"notifications found"
    )

    return notifications;
}


const markNotificationReadService = async(notificationId) => {
    if(notificationId) {
        throw new ValidationError("notification id is invalid");
    }

    logger.info({
        notificationId : notificationId
    }, "notification read");
    
    return await notificationRepository.markAsRead(undefined, notificationId);

}

export const markAllAsReadService = async(recipientMembershipId) => {
    if(!recipientMembershipId) {
        throw new ValidationError("recipientMembershipId is required");
    }

    return await notificationRepository.markAllAsRead(undefined, recipientMembershipId);
}