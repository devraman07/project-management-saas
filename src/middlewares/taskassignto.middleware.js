import { tasks } from "../data/tasks.js";

export const taskAssignedMiddleware = (req, res, next) => {
  try {
    const taskId = req.params.id;
    const currUserId = req.user.id;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        messge: " tak not found",
      });
    }

    if (task.assignedTo !== currUserId) {
      return res.status(403).json({
        success: false,
        message: "not assigne to this task",
      });
    }

    req.task = task;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Task assignee check failed",
    });
  }
};
