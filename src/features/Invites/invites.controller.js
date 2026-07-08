import {
  createInviteService,
  getInviteByTokenService,
  acceptInviteservice,
} from "./invites.service.js";

export const createInviteController = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { email, role } = req.body;

    // This MUST come from checkIsOrgMember middleware
    const invitedByMembershipId = req.membership.id;

    const result = await createInviteService(
      organizationId,
      email,
      role,
      invitedByMembershipId
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      invite: result.invite,
      message: result.message,
    });
  } catch (error) {
    console.error("Error creating invite:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getInviteByTokenController = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await getInviteByTokenService(token);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      invite: result.invite,
      message: result.message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const acceptInviteController = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await acceptInviteservice(
      token,
      req.user.id
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      membership: result.membership,
      message: result.message,
    });
  } catch (error) {
    console.error("Accept invite error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};