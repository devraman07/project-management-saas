import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { logger } from "../../shared/logger/logger.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { ProjectRepo } from "../projects/project.repository.js";
import { taskRepo } from "./task.repository.js";

export const createTaskService = async (projectId, taskData, userId) => {
  const project = await ProjectRepo.findById(undefined, projectId);

  if (!project) {
    throw new NotFoundError("task not found");
  }

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    logger.warn("not allowed to create task");
    throw new AuthorizationError("not allowed to create task");
  }

  const newTask = await taskRepo.create(undefined, {
    projectId,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    createdBy: membership.id,
  });

  logger.info(
    {
      newTask,
    },
    "new task created",
  );
  await logActivity({

    organizationId : project.organizationId,

    actorMembershipId  : userId,

    action: "TASK_CREATED",

    entityType: "TASK",

    entityId: newTask.id,

    metadata: {
        taskTitle: newTask.title,
    }

});
  return {
    success: true,
    statusCode: 201,
    task: newTask,
    message: "task created successfully",
  };
};

export const getProjectTasksService = async (projectId, userId) => {
  const project = await ProjectRepo.findById(undefined, projectId);

  if (!project) {
    throw new NotFoundError("project not found");
  }

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  const tasks = await taskRepo.findAllByProject(undefined, projectId);

  logger.info(
    {
      tasks: tasks,
    },
    "all tasks fetched successfully",
  );

  return {
    success: true,
    statusCode: 200,
    tasks: tasks,
    message: "all tasks fetched successfully",
  };
};

export const getSingleTaskService = async (taskId, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    throw new NotFoundError("task not found");
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  logger.info(
    {
      tasks: task,
    },
    "not a member of this organization",
  );

  return {
    success: true,
    statusCode: 200,
    task,
    message: "task found",
  };
};

export const updateTaskService = async (taskId, updateData, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    throw new NotFoundError("task not found");
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member");
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    logger.warn("not authorized");
    throw new AuthorizationError("not allowed to update task");
  }

  const updatedTask = await taskRepo.update(undefined, taskId, updateData);

  logger.info(
    {
      task: updatedTask,
    },
    "task updated successfully",
  );

  return {
    success: true,
    statusCode: 200,
    task: updatedTask,
    message: "task updated successfully",
  };
};

export const updateTaskStatusService = async (taskId, status, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    throw new NotFoundError("task not found");
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  const isManager = allowedRoles.includes(membership.role);

  const isAssignee = task.assignedTo === membership.id;

  if (!isManager && !isAssignee) {
    logger.warn("not allowed to update task status");
    throw new AuthorizationError("not allowed to update task status");
  }

  const updatedTask = await taskRepo.updateStatus(undefined, taskId, status);

  logger.info(
    {
      task: updatedTask,
    },
    "task status updated successfully",
  );

  return {
    success: true,
    statusCode: 200,
    task: updatedTask,
    message: "task status updated successfully",
  };
};

export const assignTaskService = async (taskId, membershipId, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    throw new NotFoundError("task not found");
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const actorMembership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!actorMembership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(actorMembership.role)) {
    logger.warn("not allowed to assign task");
    throw new AuthorizationError("not allowed to assign task");
  }

  const targetMembership = await membershipRepo.findById(
    undefined,
    membershipId,
  );

  if (!targetMembership) {
    logger.warn("target member not found");
    throw new NotFoundError("target member not found");
  }

  if (targetMembership.organizationId !== project.organizationId) {
    logger.warn("cannot assign task outside organization");
    throw new AuthorizationError("cannot assign task outside organization");
  }

  const updatedTask = await taskRepo.assign(undefined, taskId, membershipId);

  logger.info(
    {
      task: updatedTask,
    },
    "task assigned successfully",
  );

  return {
    success: true,
    statusCode: 200,
    task: updatedTask,
    message: "task assigned successfully",
  };
};

export const deleteTaskService = async (taskId, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    throw new NotFoundError("task not found");
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    logger.warn("not a member of this organization");
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    logger.warn("not allowed to delete task");
    throw new AuthorizationError("not allowed to delete task");
  }

  await taskRepo.softDelete(undefined, taskId);

  logger.info(
    {
      task: taskId,
    },
    "task moved to bin successfully",
  );

  return {
    success: true,
    statusCode: 200,
    message: "task moved to bin successfully",
  };
};
