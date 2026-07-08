import { tasks } from "../data/tasks.js";

export const taskOwnerMiddleware = (req, res, next) => {
  try {
    const taskId = req.params.id;
    const curruserId = req.user.id;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    if (task.managerId !== curruserId) {
      return res.status(403).json({
        success: false,
        message: "Must be a manager to update a task",
      });
    }

    req.task = task;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Task ownership check failed",
    });
  }
};
