import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { createCommentValidator, upDateCommentValidator } from "../comments/comments.validator.js";
import { createReplyController, deleteReplyController, getRepliesController, updateReplyController } from "./repllies.controller.js";




export const ReplyRouter = Router({
  mergeParams: true,
});

ReplyRouter.post(
  "/",
  authMiddleware,
  createCommentValidator,
  createReplyController
);

ReplyRouter.get(
  "/",
  authMiddleware,
  getRepliesController
);

ReplyRouter.patch(
  "/:replyId",
  authMiddleware,
  upDateCommentValidator,
  updateReplyController
);

ReplyRouter.patch(
  "/:replyId/delete",
  authMiddleware,
  deleteReplyController
);