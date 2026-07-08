import jwt from "jsonwebtoken";


export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const token = authHeader.split(" ")[1];

   
    const verifiedUser = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = verifiedUser;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
