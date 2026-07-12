import { AuthorizationError } from "../errors/AuthorizationError.js";
import { ROLES } from "../shared/constants/roles.js";

export const ownerOrAdmincheck = (req, res, next) => {
  try {
    const currUser = req.user;
    const targetUserId = req.params.id;

    const isowner = currUser.id === targetUserId;

    const isAdmin = currUser.role === ROLES.ADMIN;

    if (!isowner && !isAdmin) {
      throw new AuthorizationError("forbidden");
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed error in owner or admin check middlware",
    });
  }
};
