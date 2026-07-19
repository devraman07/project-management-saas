import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { createAttachmentController, getAttachmentByTaskController } from "./attachments.controller.js";



export const TaskattachmentRouter = Router({mergeParams : true});

TaskattachmentRouter.post("/", authMiddleware, upload.single("file"), createAttachmentController);
TaskattachmentRouter.get("/", authMiddleware,  getAttachmentByTaskController);
