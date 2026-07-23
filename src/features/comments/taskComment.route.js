import { Router } from "express";
import {
  createCommentValidator,
  upDateCommentValidator,
} from "./comments.validator.js";
import {
  createCommentController,
  deletecommentController,
  getcommentsByTaskController,
  updatecommentController,
} from "./comments.controller.js";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { createReplyController } from "../Replies/repllies.controller.js";
import { ReplyRouter } from "../Replies/reply.routes.js";

export const TaskCommentRouter = Router({
  mergeParams: true,
});

TaskCommentRouter.post(
  "/",
  authMiddleware,
  createCommentValidator,
  createCommentController,
);
TaskCommentRouter.get("/", authMiddleware, getcommentsByTaskController);
TaskCommentRouter.patch(
  "/:commentId/update",
  authMiddleware,
  upDateCommentValidator,
  updatecommentController,
);
TaskCommentRouter.patch(
  "/:commentId/delete",
  authMiddleware,
  deletecommentController,
);
TaskCommentRouter.use("/:commentId/replies", ReplyRouter);
