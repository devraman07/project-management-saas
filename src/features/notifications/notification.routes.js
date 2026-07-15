import express from "express";
import {
  getAllNotificationController,
  markAllAsReadController,
  readNotificationController,
} from "./notification.controller.js";
import { authMiddleware } from "../../middlewares/auth.middileware.js";

export const notificationRouter = express.Router();

notificationRouter.use(authMiddleware);

notificationRouter.get(
  "/:organizationId/notifications",
  getAllNotificationController,
);

notificationRouter.patch(
  "/:organizationId/notifications/:notificationId/read",
  readNotificationController,
);

notificationRouter.patch(
  "/:organizationId/notifications/read-all",
  markAllAsReadController,
);
