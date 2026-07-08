import {
  deleteUserService,
  fetchUserProfileService,
  getallUsersService,
  updateUserservice,
} from "./users.service.js";

export const getusersController = (req, res) => {
  try {
    const result = getallUsersService();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      users: result.users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const profileController = (req, res) => {
  try {
    const id = req.user.id;

    const result = fetchUserProfileService(id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      uerProfile: result.user,
      message: "user found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

export const updateUserController = (req, res) => {
  try {
    const targetuserId = req.params.id;
    const updateData = req.body;

    const result = updateUserservice(targetuserId, updateData);

    if (!result.success) {
      return res.status(result.statuscode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      user: result.user,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error in update user controller",
    });
  }
};

export const deleteUserController = (req, res) => {
  try {
    const targetUserId = req.params.id;

    const result = deleteUserService(targetUserId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in delete user controller",
    });
  }
};
