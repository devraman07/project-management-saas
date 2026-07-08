import { userrepo } from "./users.repoitory.js";

export const getallUsersService = () => {
  const user = userrepo.findAll();

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

export const fetchUserProfileService = (id) => {
  if (!id) {
    return {
      success: false,
      statusCode: 403,
      message: "authenticate frist",
    };
  }

  const profile = userrepo.findById(id);

  const safeUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
  };

  return {
    success: true,
    user: safeUser,
  };
};

export const updateUserservice = (targetuserId, updateData) => {
  const user = userrepo.findById(targetuserId);

  if (updateData.name) {
    user.name = updateData.name;
  }

  if (updateData.email) {
    user.email = updateData.email;
  }

  if (!user) {
    return {
      success: false,
      statuscode: 403,
      message: "User not found",
    };
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return {
    success: true,
    user: safeUser,
    message: "user updated successfully",
  };
};

export const deleteUserService = (targetUserId) => {
  const userIndex = userrepo.findById(targetUserId);

  if (userIndex === -1) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found",
    };
  }

  userrepo.delete(userIndex);

  return {
    success: true,
    message: "user deleted successfully",
  };
};
