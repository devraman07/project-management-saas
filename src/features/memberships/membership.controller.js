import { membershipRepo } from "./membership.repository.js";
import {
  addMemberService,
  deleteMymembershipService,
  getMemberService,
  getMyMbershipService,
  removeMemberService,
  updateMemberRoleService,
} from "./membership.service.js";

export const getMembersController = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const result = await getMemberService(organizationId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        members: result.members,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      members: result.members,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get members controller",
    });
  }
};

export const myMembershipsController = async (req, res) => {
  try {
    const result = await getMyMbershipService(req.user);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      memberships: result.memberships,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get my memberships controller",
    });
  }
};

export const deleteMyMembershipController = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const result = await deleteMymembershipService(req.user.id, organizationId);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get my memberships controller",
    });
  }
};

export const updateMemberRoleController = async (req, res) => {
  try {
    const { organizationId, membershipId } = req.params;

    const { role } = req.body;

    const result = await updateMemberRoleService(
      organizationId,
      membershipId,
      role,
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
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside update member role controller",
    });
  }
};

export const addMemberController = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const { email, role } = req.body;

    const result = await addMemberService(
      organizationId,
      email,
      role,
      req.user.id,
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
    console.log(error);
    console.log(error.cause);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside add member controller",
    });
  }
};

export const removeMemberController = async (req, res) => {
  try {
    const { organizationId, membershipId } = req.params;

    const result = await removeMemberService(
      organizationId,
      membershipId,
      req.user.id,
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside remove member controller",
    });
  }
};
