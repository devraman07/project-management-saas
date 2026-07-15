import { ValidationError } from "../../errors/ValidationError.js";
import { notificationRepository } from "./notification.repository.js";
import { logger } from "../../shared/logger/logger.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

export const createNotificationService = async ({
  organizationId,
  recipientMembershipId,
  activityId,
}) => {
  if (!organizationId) {
    throw new ValidationError("organization id is required");
  }
  if (!recipientMembershipId) {
    throw new ValidationError("recipient membership is required");
  }
  if (!activityId) {
    throw new ValidationError("activity id is required");
  }

  const notification = await notificationRepository.create(undefined, {
    organizationId,
    recipientMembershipId,
    activityId,
  });

  logger.info(
    {
      notificationId: notification.id,
      recipientMembershipId,
      activityId,
    },
    "Notification created",
  );

  return notification;
};

export const getNotificationsService = async (userId, organizationId) => {
  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    organizationId,
  );

  if (!membership) {
    throw new AuthorizationError("not a member of this organization");
  }

  const notifications = await notificationRepository.findByReplicant(
    undefined,
    membership.id,
  );

  const unreadCount = await notificationRepository.countUnread(
    undefined,
    membership.id,
  );

  logger.info(
    {
      recipientMembershipId: membership.id,
    },
    "notifications found",
  );

  return {
    success: true,
    statusCode: 200,
    notifications: notifications,
    unreadCount: unreadCount,
  };
};

export const markNotificationReadService = async (
  userId,
  notificationId,
  organizationId,
) => {
  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    organizationId,
  );

  if (!membership) {
    throw new AuthorizationError("Not allowed to read this notification");
  }

  const notification = await notificationRepository.findById(
    undefined,
    notificationId,
  );

  if (!notification) {
    throw new NotFoundError("notification not found");
  }

  if (notification.recipientMembershipId !== membership.id) {
    throw new AuthorizationError("Not your notification mate");
  }

  const updatedNotification = await notificationRepository.markAsRead(
    undefined,
    notificationId,
  );

  return {
    success: true,
    statusCode: 200,
    notification: updatedNotification,
    message: "Notification read successfully",
  };
};

export const markAllAsReadService = async (userId, organizationId) => {
  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    organizationId,
  );

  if (!membership) {
    throw new AuthorizationError("not a member");
  }

  await notificationRepository.markAllAsRead(undefined, membership.id);

  return {
    success: true,
    statusCode: 200,
    message: "all notification read",
  };
};