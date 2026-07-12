import { tasks } from "../data/tasks.js";
import { AuthorizationError } from "../errors/AuthorizationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const taskOwnerMiddleware = (req, res, next) => {
  try {
    const taskId = req.params.id;
    const curruserId = req.user.id;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new NotFoundError("task not found");
    }

    if (task.managerId !== curruserId) {
     throw new AuthorizationError("Must be a manager to update a task");
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
