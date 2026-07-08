import {
    assignTaskService,
  createTaskService,
  getProjectTasksService,
  getSingleTaskService,
  updateTaskService,
  updateTaskStatusService,
} from "./task.service.js";

export const createTaskController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const taskData = req.body;

    const result = await createTaskService(projectId, taskData, req.user.id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      task: result.task,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside create task controller",
    });
  }
};

export const getProjectTasksController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await getProjectTasksService(projectId, req.user.id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      tasks: result.tasks,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get project tasks controller",
    });
  }
};

export const getSingleTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await getSingleTaskService(taskId, req.user.id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      task: result.task,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get single task controller",
    });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;

    const updateData = req.body;

    const result = await updateTaskService(taskId, updateData, req.user.id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      task: result.task,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside update task controller",
    });
  }
};

export const updateTaskStatusController =
  async (req, res) => {
    try {
      const { taskId } =
        req.params;

      const { status } =
        req.body;

      const result =
        await updateTaskStatusService(
          taskId,
          status,
          req.user.id
        );

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(result.statusCode).json({
        success: true,
        task: result.task,
        message: result.message,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message:
          "error inside update task status controller",
      });
    }
  };

  export const assignTaskController =
  async (req, res) => {
    try {
      const { taskId } =
        req.params;

      const { membershipId } =
        req.body;

      const result =
        await assignTaskService(
          taskId,
          membershipId,
          req.user.id
        );

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(result.statusCode).json({
        success: true,
        task: result.task,
        message: result.message,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message:
          "error inside assign task controller",
      });
    }
  };

  export const deleteTaskController =
  async (req, res) => {
    try {
      const { taskId } =
        req.params;

      const result =
        await deleteTaskService(
          taskId,
          req.user.id
        );

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
        message:
          "error inside delete task controller",
      });
    }
  };
