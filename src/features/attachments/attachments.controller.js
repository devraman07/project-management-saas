import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  createAttachmentService,
  deleteAttachmentService,
  getAttachmentByTaskService,
  getSingleattachmentService,
} from "./attachments.service.js";

export const createAttachmentController = asyncHandler(async (req, res) => {
  const result = await createAttachmentService(
    req.user.id,
    req.params.taskId,
    req.file,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    data: result.attachment,
    message: result.message,
  });
});

export const getAttachmentByTaskController = asyncHandler(async (req, res) => {
  const result = await getAttachmentByTaskService(
    req.user.id,
    req.params.taskId,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    data: result.attachments,
    message: result.message,
  });
});

export const deleteAttachmentController = asyncHandler(async (req, res) => {
  const result = await deleteAttachmentService(
    req.user.id,
    req.params.attachmentId,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    data: result.attachment,
    message: result.message,
  });
});

export const getSingleattachmentController = asyncHandler(async(req, res) => {

    const result = await getSingleattachmentService(req.user.id, req.params.attachmentId);

    return res.status(result.statusCode).json({
        success : result.success,
        data : result.attachment,
        message : result.message
    })
})
