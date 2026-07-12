import { AuthorizationError } from "../errors/AuthorizationError.js";

export const roleMiddleware = (...allowedroles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      const isAllowed = allowedroles.includes(userRole);

      if (!isAllowed) {
        throw new AuthorizationError("Access denied");
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Role middleware failed",
      });
    }
  };
};
