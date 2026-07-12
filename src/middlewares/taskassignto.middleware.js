import { tasks } from "../data/tasks.js";
import { AuthorizationError } from "../errors/AuthorizationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const taskAssignedMiddleware = (req, res, next) => {
  try {
    const taskId = req.params.id;
    const currUserId = req.user.id;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new NotFoundError("task not found");
    }

    if (task.assignedTo !== currUserId) {
      throw new AuthorizationError("not assigne to this task");
    }

    req.task = task;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Task assignee check failed",
    });
  }
};
