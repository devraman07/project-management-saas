import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  loginService,
  logOutService,
  profileservice,
  refreshService,
  registerService,
} from "./auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
  const result = await registerService(req.body);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

export const userProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = profileservice(userId);

  return res.status(result.statusCode).json({
    success: true,
    user: result.user,
    message: "user authenticated successsfully",
  });
});

export const refreshController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await refreshService(refreshToken, req.refreshuser);

  return res.status(result.statusCode).json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    message: result.message,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await logOutService(refreshToken);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});
