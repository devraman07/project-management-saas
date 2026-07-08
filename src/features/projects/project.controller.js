import {
  archiveprojectService,
  createProjectService,
  getAllprojectsByOrganizationService,
  getSingleProjectService,
  updateProjectService,
  updateProjectStatusService,
} from "./projectService.js";

export const createProjectController = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const { projectData } = req.body;

    const result = await createProjectService(
      organizationId,
      projectData,
      req.user,
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      project: result.project,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error in add project controller",
    });
  }
};

export const getProjectsController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error in get projects by organization controller",
    });
  }
};

export const getSingleProjectController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const result = await getSingleProjectService(userId, projectId);
    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      project: result.project,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error in get project by id controller",
    });
  }
};

export const updateProjectController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const updateData = req.body;

    const userId = req.user.id;

    const result = await updateProjectService(projectId, updateData, userId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      project: result.project,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error in update project controller",
    });
  }
};

export const updateProjectStatusController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { status } = req.body;

    const result = await updateProjectStatusService(
      projectId,
      status,
      req.user.id,
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      project: result.project,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside update project status controller",
    });
  }
};

export const archiveprojectController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const userId = req.user.id;

    const result = await archiveprojectService(projectId, userId);
    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside delete project status controller",
    });
  }
};
