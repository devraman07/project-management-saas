import { ProjectRepo } from "./project.repository.js";
import { membershipRepo } from "../memberships/membership.repository.js";

export const createProjectService = async (
  organizationId,
  projectData,
  user,
) => {
  const existingProject = await ProjectRepo.findByName(
    undefined,
    projectData.name,
  );

  if (existingProject) {
    return {
      success: false,
      statusCode: 409,
      message: "project already exists with same name",
    };
  }

  const newproject = await ProjectRepo.Create(undefined, {
    organizationId,
    name: projectData.name,
    description: projectData.description,
    createdBy: user.id,
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
    return {
      success: false,
      statusCode: 404,
      message: "projects not found",
    };
  }

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
    return res.status(404).json({
      success: false,
      message: "project not found",
    });
  }

  const memberShip = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    project.organizationId,
  );

  if (!memberShip) {
    return {
      success: false,
      statusCode: 403,
      message: "access denied in project ",
    };
  }
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
      message: "not allowed to update project",
    };
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
      message: "not allowed to update project status",
    };
  }

  const updatedProject = await ProjectRepo.updateStatus(
    undefined,
    projectId,
    status,
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
      message: "not allowed to update project",
    };
  }

  await ProjectRepo.softDelete(undefined, projectId);

  return {
    success: true,
    statusCode: 200,
    message: "project moved to bin",
  };
};
