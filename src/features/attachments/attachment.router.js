import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { deleteAttachmentController, getSingleattachmentController } from "./attachments.controller.js";


export const attachmentRouter = Router();

attachmentRouter.patch("/:attachmentId/delete", authMiddleware, deleteAttachmentController );
attachmentRouter.get("/:attachmentId", authMiddleware, getSingleattachmentController);
