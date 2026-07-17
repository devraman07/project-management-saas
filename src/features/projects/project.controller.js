import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  archiveprojectService,
  createProjectService,
  getAllprojectsByOrganizationService,
  getSingleProjectService,
  updateProjectService,
  updateProjectStatusService,
} from "./project.service.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const membership = req.membership;

  console.log(req.body);
  console.log(req.params);

 const result = await createProjectService(
  organizationId,
  req.body,
  req.user,
  membership,
);

  return res.status(result.statusCode).json({
    success: true,
    project: result.project,
    message: result.message,
  });
});

export const getProjectsController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const result = await getAllprojectsByOrganizationService(organizationId);

  if (!result.success) {
    return res.status(result.statusCode).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(result.statusCode).json({
    success: true,
    projects: result.projects,
    message: result.message,
  });
});

export const getSingleProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  const result = await getSingleProjectService(userId, projectId);

  return res.status(result.statusCode).json({
    success: true,
    project: result.project,
    message: result.message,
  });
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const updateData = req.body;

  const userId = req.user.id;

  const result = await updateProjectService(projectId, updateData, userId);

  return res.status(result.statusCode).json({
    success: true,
    project: result.project,
    message: result.message,
  });
});

export const updateProjectStatusController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const { status } = req.body;

  const result = await updateProjectStatusService(
    projectId,
    status,
    req.user.id,
  );

  return res.status(result.statusCode).json({
    success: true,
    project: result.project,
    message: result.message,
  });
});

export const archiveprojectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const userId = req.user.id;

  const result = await archiveprojectService(projectId, userId);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});
