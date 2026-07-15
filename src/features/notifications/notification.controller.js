import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  getNotificationsService,
  markNotificationReadService,
  markAllAsReadService,
} from "./notification.service.js";

export const getAllNotificationController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const result = await getNotificationsService(req.user.id, organizationId);

  return res.status(result.statusCode).json({
    success: true,
    notifications: result.notifications,
    unreadCount: result.unreadCount,
    message: "notification fetched successfully",
  });
});

export const readNotificationController = asyncHandler(async (req, res) => {
  const { notificationId, organizationId } = req.params;

  const result = await markNotificationReadService(
    req.user.id,
    notificationId,
    organizationId,
  );

  return res.status(result.statusCode).json({
    success: true,
    notification: result.notification,
    message: result.message,
  });
});

export const markAllAsReadController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const result = await markAllAsReadService(req.user.id, organizationId);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});