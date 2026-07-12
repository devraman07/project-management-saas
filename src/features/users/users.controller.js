import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  deleteUserService,
  fetchUserProfileService,
  getallUsersService,
  updateUserservice,
} from "./users.service.js";

export const getusersController = asyncHandler(async (req, res) => {
  const result = await getallUsersService();

  return res.status(200).json({
    success: true,
    users: result.users,
  });
});

export const profileController = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const result = fetchUserProfileService(id);

  return res.status(200).json({
    success: true,
    uerProfile: result.user,
    message: "user found",
  });
});

export const updateUserController = asyncHandler(async (req, res) => {
  const targetuserId = req.params.id;
  const updateData = req.body;

  const result = updateUserservice(targetuserId, updateData);

  return res.status(200).json({
    success: true,
    user: result.user,
    message: result.message,
  });
});
export const deleteUserController = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;

  const result = deleteUserService(targetUserId);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});
