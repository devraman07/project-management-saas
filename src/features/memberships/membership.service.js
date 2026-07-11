import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { logger } from "../../shared/logger/logger.js";
import { userrepo } from "../users/users.repoitory.js";
import { membershipRepo } from "./membership.repository.js";

export const getMemberService = async (organizationId) => {
  const members = await membershipRepo.findAllByOrg(undefined, organizationId);

  if (members.length === 0) {
    throw new NotFoundError("members not found");
  }

  return {
    success: true,
    statusCode: 200,
    members,
    message: "all members for this organization",
  };
};

export const getMyMbershipService = async (user) => {
  const memberships = await membershipRepo.findByUser(undefined, user.id);

  if (memberships.length === 0) {
    throw new NotFoundError("No membership found for this user");
  }

  return {
    success: true,
    statusCode: 200,
    memberships,
    message: "memberships found",
  };
};

export const deleteMymembershipService = async (userId, organizationId) => {
  const membership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    userId,
    organizationId,
  );

  if (!membership) {
   throw new NotFoundError("membership not found");
  }

  if (membership.role === "OWNER") {
    logger.warn("owner cannot leave organization without transferring ownership");
    throw new AuthorizationError("owner cannot leave organization without transferring ownership");
  }

  await membershipRepo.delete(undefined, membership.id);

  logger.info({
    membership : membership
  }, "membership deleted successfully");

  return {
    success: true,
    statusCode: 200,
    message: "membership deleted successfully",
  };
};

export const updateMemberRoleService = async (
  organizationId,
  membershipId,
  role,
) => {
  const membership = await membershipRepo.findById(undefined, membershipId);

  if (!membership) {
    return {
      success: false,
      statusCode: 404,
      message: "membership not found",
    };
  }

  if (membership.organizationId !== organizationId) {
    return {
      success: false,
      statusCode: 403,
      message: "membership does not belong to this organization",
    };
  }

  if (membership.role === "OWNER") {
    return {
      success: false,
      statusCode: 403,
      message: "owner role cannot be changed",
    };
  }

  if (role === "OWNER") {
    return {
      success: false,
      statusCode: 403,
      message: "use transfer ownership route instead",
    };
  }

  const updatedMembership = await membershipRepo.updateRole(
    undefined,
    membershipId,
    role,
  );

  return {
    success: true,
    statusCode: 200,
    membership: updatedMembership,
    message: "member role updated successfully",
  };
};

export const addMemberService = async (
  organizationId,
  email,
  role,
  ownerId,
) => {
  const user = await userrepo.findByEmail(email);

  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "user not found",
    };
  }

  if (user.id === ownerId) {
    return {
      success: false,
      statusCode: 400,
      message: "owner is already part of this organization",
    };
  }

  const existingMembership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    user.id,
    organizationId,
  );

  if (existingMembership) {
    return {
      success: false,
      statusCode: 409,
      message: "user already belongs to this organization",
    };
  }

  if (role === "OWNER") {
    return {
      success: false,
      statusCode: 403,
      message: "owner role cannot be assigned directly",
    };
  }

  const membership = await membershipRepo.createMembership(undefined, {
    userId: user.id,
    organizationId,
    role,
    invitedBy: ownerId,
  });

  return {
    success: true,
    statusCode: 201,
    membership,
    message: "member added successfully",
  };
};

export const removeMemberService = async (
  organizationId,
  membershipId,
  currentUserId,
) => {
  const membership = await membershipRepo.findById(undefined, membershipId);

  if (!membership) {
    return {
      success: false,
      statusCode: 404,
      message: "membership not found",
    };
  }

  // ensure target belongs to same organization
  if (membership.organizationId !== organizationId) {
    return {
      success: false,
      statusCode: 403,
      message: "membership does not belong to this organization",
    };
  }

  // owner cannot be removed
  if (membership.role === "OWNER") {
    return {
      success: false,
      statusCode: 403,
      message: "owner cannot be removed",
    };
  }

  // owner cannot remove himself here
  if (membership.userId === currentUserId) {
    return {
      success: false,
      statusCode: 400,
      message: "use leave organization route instead",
    };
  }

  await membershipRepo.delete(undefined, membershipId);

  return {
    success: true,
    statusCode: 200,
    message: "member removed successfully",
  };
};
