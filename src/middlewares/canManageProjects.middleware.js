

export const canManageProjectMiddleware = (req, res, next) => {
    try {
         const allowedRoles = [
      "OWNER",
      "ADMIN",
      ];

    const userRole = req.membership.role;


    if(!allowedRoles.includes(userRole)) {
        return res.status(403).json({
            success : false,
            message : "not allowed to create project",
        });
    }
    next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : error.message,
            message : "error inside manage project middleware",
        });
    }
}