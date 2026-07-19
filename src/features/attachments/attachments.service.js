import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { BadRequestError } from "../../errors/BadrequestError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { deleteFromCloudinary } from "../../shared/Helpers/deleteCloudinary.js";
import { uploadToCloudinary } from "../../shared/Helpers/fileUploadHelper.js";
import { getTaskFromMembership } from "../../shared/Helpers/getMembershipFromTask.js";
import { logActivity } from "../../shared/utils/activity/Logger.js";
import { taskRepo } from "../tasks/task.repository.js";
import { attachmentsRepo } from "./attachments.repository.js";

export const createAttachmentService = async (userId, taskId, file) => {
  if (!file) {
    throw new BadRequestError("file not coming from req in the service");
  }

  const { membership, task, project } = await getTaskFromMembership(
    userId,
    taskId,
  );

  console.log(file);

  const uploadedFile = await uploadToCloudinary(file.path);
  console.log(uploadedFile);

  const attachment = await attachmentsRepo.create(undefined, {
    taskId,
    membershipId: membership.id,

    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    fileSize: file.size,

    storageKey: uploadedFile.storageKey,
    url: uploadedFile.url,
  });

  await logActivity({
    action: "ATTACHMENT_CREATED",
    entityType: "ATTACHMENT",
    entityId: attachment.id,
    membershipId: membership.id,
    organizationId: project.organizationId,
    projectId: project.id,
    taskId: task.id,

    metadata: {
      attachment: {
        id: attachment.id,
        name: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.fileSize,
      },
    },
  });

  return {
    success: true,
    statusCode: 201,
    attachment: attachment,
    message: "attachment uploaded successfully",
  };
};

export const getAttachmentByTaskService = async (userId, taskId) => {
  if (!taskId) {
    throw new ValidationError("task id is required");
  }

  const { task, project, membership } = await getTaskFromMembership(
    userId,
    taskId,
  );

  const attachments = await attachmentsRepo.findByTask(undefined, taskId);

  return {
    success: true,
    statusCode: 200,
    attachments: attachments,
    message: "attachments fetched successfully",
  };
};

export const deleteAttachmentService = async (userId, attachmenttId) => {
  if (!attachmenttId) {
    throw new ValidationError("attachment id not coming from request");
  }

  const attachment = await attachmentsRepo.findById(undefined, attachmenttId);

  if (!attachment) {
    throw new NotFoundError("attachment not found");
  }

  const { task, project, membership } = await getTaskFromMembership(
    userId,
    attachment.taskId,
  );

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    throw new ForbiddenError(
      "You don't have permission to delete attachments.",
    );
  }

  await deleteFromCloudinary(attachment.storageKey);

  const deletedAttachment = await attachmentsRepo.softDelete(
    undefined,
    attachment.id,
  );

  await logActivity({
    action: "ATTACHMENT_DELETED",
    actorMembershipId: membership.id,
    organizationId: project.organizationId,
    projectId: project.id,
    taskId: task.id,
    entityType: "ATTACHMENT",
    entityId: attachment.id,
    metadata: {
      attachment: {
        id: attachment.id,
        name: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.fileSize,
      },
    },
  });

  return {
    success: true,
    statusCode: 200,
    attachment: deletedAttachment,
    message: "attachment moved to bin",
  };
};


export const getSingleattachmentService = async( userId, attachmentId) => {
     
    const attachment = await attachmentsRepo.findById( undefined,attachmentId);

    if(!attachment) {
        throw new NotFoundError("attachment not found");
    }

    const {task, project, membership } = await getTaskFromMembership(userId, attachment.taskId);

    if(!membership) {
        throw new AuthorizationError("not allowed to see attachment");
    }

    return {
        success : true,
        statusCode : 200,
        attachment : attachment,
        message : "attachment fetched successfully",
    }
}
