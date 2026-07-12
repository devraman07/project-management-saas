import { ValidationError } from "../../errors/ValidationError.js";
import { userrepo } from "./users.repoitory.js";
import { AuthenticationError } from "../../errors/AuthenticationError.js";
import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { logger } from "../../shared/logger/logger.js";

export const getallUsersService = async () => {
  const user = await userrepo.findAll();

  if(!user) {
    throw new ValidationError("user not found");
  }

  const safeUsers = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };



  return {
    success: true,
    users: safeUsers,
    message: "all users found",
  };
};

export const fetchUserProfileService = async (id) => {
  if (!id) {
    throw new AuthenticationError("login frist");
  }

  const profile = await userrepo.findById(id);

  const safeUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
  };

  return {
    success: true,
    user: safeUser,
    message : "user profile found successfully"
  };
};

export const updateUserservice = async (targetuserId, updateData) => {
  const user = await userrepo.findById(targetuserId);

  if (updateData.name) {
    user.name = updateData.name;
  }

  if (updateData.email) {
    user.email = updateData.email;
  }

  if (!user) {
   throw new AuthorizationError("user not found");
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  logger.info({user : safeUser},"user updated successfully");

  return {
    success: true,
    user: safeUser,
    message: "user updated successfully",
  };
};

export const deleteUserService = async (targetUserId) => {
  const userIndex  = await userrepo.findById(targetUserId);

  if (userIndex === -1) {
    throw new NotFoundError("user not found");
  }

  userrepo.delete(userIndex);

  logger.info( {user : targetUserId}, "user deleted successfully");

  return {
    success: true,
    message: "user deleted successfully",
  };
};
