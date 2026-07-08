import { membershipRepo } from "../memberships/membership.repository.js";
import { ProjectRepo } from "../projects/project.repository.js";
import { taskRepo } from "./task.repository.js";

export const createTaskService = async (projectId, taskData, userId) => {
  const project = await ProjectRepo.findById(undefined, projectId);

  if (!project) {
    return {
      success: false,
      statusCode: 404,
      message: "project not found",
    };
  }

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "not allowed to create task",
    };
  }

  const newTask = await taskRepo.create(undefined, {
    projectId,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    createdBy: membership.id,
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
    return {
      success: false,
      statusCode: 404,
      message: "project not found",
    };
  }

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const tasks = await taskRepo.findAllByProject(undefined, projectId);

  return {
    success: true,
    statusCode: 200,
    tasks,
    message: "all tasks fetched successfully",
  };
};

export const getSingleTaskService = async (taskId, userId) => {
  const task = await taskRepo.findById(undefined, taskId);

  if (!task) {
    return {
      success: false,
      statusCode: 404,
      message: "task not found",
    };
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

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
    return {
      success: false,
      statusCode: 404,
      message: "task not found",
    };
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "not allowed to update task",
    };
  }

  const updatedTask = await taskRepo.update(undefined, taskId, updateData);

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
    return {
      success: false,
      statusCode: 404,
      message: "task not found",
    };
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  const isManager = allowedRoles.includes(membership.role);

  const isAssignee = task.assignedTo === membership.id;

  if (!isManager && !isAssignee) {
    return {
      success: false,
      statusCode: 403,
      message: "not allowed to update task status",
    };
  }

  const updatedTask = await taskRepo.updateStatus(undefined, taskId, status);

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
    return {
      success: false,
      statusCode: 404,
      message: "task not found",
    };
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const actorMembership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!actorMembership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(actorMembership.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "not allowed to assign task",
    };
  }

  const targetMembership = await membershipRepo.findById(
    undefined,
    membershipId,
  );

  if (!targetMembership) {
    return {
      success: false,
      statusCode: 404,
      message: "target member not found",
    };
  }

  if (targetMembership.organizationId !== project.organizationId) {
    return {
      success: false,
      statusCode: 403,
      message: "cannot assign task outside organization",
    };
  }

  const updatedTask = await taskRepo.assign(undefined, taskId, membershipId);

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
    return {
      success: false,
      statusCode: 404,
      message: "task not found",
    };
  }

  const project = await ProjectRepo.findById(undefined, task.projectId);

  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!membership) {
    return {
      success: false,
      statusCode: 403,
      message: "not a member of this organization",
    };
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    return {
      success: false,
      statusCode: 403,
      message: "not allowed to delete task",
    };
  }

  await taskRepo.softDelete(undefined, taskId);

  return {
    success: true,
    statusCode: 200,
    message: "task moved to bin successfully",
  };
};
