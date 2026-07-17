import { ProjectRepo } from "./project.repository.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { conflictError } from "../../errors/conflictError.js";
import { logger } from "../../shared/logger/logger.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { logActivity } from "../../shared/utils/activity/Logger.js";

export const createProjectService = async (
  organizationId,
  projectData,
  user,
  memberShip
) => {
  const existingProject = await ProjectRepo.findByName(
    undefined,
    projectData.name,
  );

  if (existingProject) {
    throw new conflictError("project already exists with same name");
  }

  const newproject = await ProjectRepo.Create(undefined, {
    organizationId,
    name: projectData.name,
    description: projectData.description,
    createdBy: user.id,
  });

  logger.info(
    {
      project: newproject,
    },
    "project created successfully",
  );

  await logActivity({

    organizationId : organizationId,

    actorMembershipId : memberShip.id,

    action: "PROJECT_CREATED",

    entityType: "PROJECT",

    entityId: newproject.id,

    metadata: {
        projectName: newproject.name,
    }

});

  return {
    success: true,
    statusCode: 201,
    message: "Project created successfully",
    project: newproject,
  };
};

export const getAllprojectsByOrganizationService = async (organizationId) => {
  const projects = await ProjectRepo.findAllByOrganization(
    undefined,
    organizationId,
  );

  if (projects.length == 0) {
    throw new NotFoundError("project not found");
  }

  logger.info(
    {
      projects: projects,
    },
    "projects fetched successfully for an organization",
  );

  return {
    success: true,
    statusCode: 200,
    projects: projects,
    message: "projects found for this organization",
  };
};

export const getSingleProjectService = async (userId, projectId) => {
  const project = await ProjectRepo.findById(undefined, projectId);

  if (!project) {
    throw new NotFoundError("project not found");
  }

  const memberShip = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!memberShip) {
    throw new AuthorizationError("access denied in this project");
  }

  logger.info(
    {
      project: project,
    },
    "project found",
  );
  return {
    success: true,
    statusCode: 200,
    project: project,
    message: "Project found",
  };
};

export const updateProjectService = async (projectId, updateData, userId) => {
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
    throw new AuthorizationError("not a member of this organization");
  }

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    throw new AuthorizationError("not authorized to update this project");
  }

  const updatedProject = await ProjectRepo.update(
    undefined,
    projectId,
    updateData,
  );

  return {
    success: true,
    statusCode: 200,
    project: updatedProject,
    message: "project updated successfully",
  };
};

export const updateProjectStatusService = async (projectId, status, userId) => {
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

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    logger.warn("not allowed to update project status");
    throw new AuthorizationError("not allowed to update project status");
  }

  const updatedProject = await ProjectRepo.updateStatus(
    undefined,
    projectId,
    status,
  );

  logger.info(
    {
      project: updatedProject,
    },
    "project status updated successfully",
  );

  return {
    success: true,
    statusCode: 200,
    project: updatedProject,
    message: "project status updated successfully",
  };
};

export const archiveprojectService = async (projectId, userId) => {
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

  const allowedRoles = ["OWNER", "ADMIN", "PROJECT_MANAGER"];

  if (!allowedRoles.includes(membership.role)) {
    logger.warn("not allowed to update project");
    throw new AuthorizationError("not allowed to update project");
  }

  await ProjectRepo.softDelete(undefined, projectId);

  logger.info(
    {
      project: projectId,
    },
    "project moved to bin",
  );

  return {
    success: true,
    statusCode: 200,
    message: "project moved to bin",
  };
};
