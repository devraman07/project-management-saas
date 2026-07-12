import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { conflictError } from "../../errors/conflictError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { logger } from "../../shared/logger/logger.js";
import { userrepo } from "../users/users.repoitory.js";
import { membershipRepo } from "./membership.repository.js";

export const getMemberService = async (organizationId) => {
  const members = await membershipRepo.findAllByOrg(undefined, organizationId);

  if (members.length === 0) {
    throw new NotFoundError("members not found");
  }

  logger.info({
    members : members
  }, "members found");

  return {
    success: true,
    statusCode: 200,
    members : members,
    message: "all members for this organization",
  };
};

export const getMyMbershipService = async (user) => {
  const memberships = await membershipRepo.findByUser(undefined, user.id);

  if (memberships.length === 0) {
    throw new NotFoundError("No membership found for this user");
  }

  logger.info({
    memberships : memberships
  }, "memberships found");

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
   throw new NotFoundError("membership not found");
  }

  if (membership.organizationId !== organizationId) {
   logger.warn("membership does not belong to this organization");
   throw new AuthorizationError("membership does not belong to this organization");
  }

  if (membership.role === "OWNER") {
    logger.warn("owner role cannot be changed");
    throw new AuthorizationError("owner role cannot be changed");
  }

  if (role === "OWNER") {
    logger.warn("use transfer ownership route instead");
    throw new AuthorizationError("use transfer ownership route instead");
  }

  const updatedMembership = await membershipRepo.updateRole(
    undefined,
    membershipId,
    role,
  );

  logger.info({
    membership : updatedMembership
  }, "member role updated successsfully");

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
    throw new NotFoundError("user not found");
  }

  if (user.id === ownerId) {
    logger.warn("owner is already part of this organization");
    throw new ValidationError("owner is already part of this organization");
  }

  const existingMembership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    user.id,
    organizationId,
  );

  if (existingMembership) {
    throw new conflictError("user already belongs to this organization");
  }

  if (role === "OWNER") {
    logger.warn("owner role cannot be assigned directly");
   throw new AuthorizationError("owner role cannot be assigned directly");
  }

  const membership = await membershipRepo.createMembership(undefined, {
    userId: user.id,
    organizationId,
    role,
    invitedBy: ownerId,
  });


  logger.info({
    membership : membership,
  }, "member added successfully");

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
    throw new NotFoundError("membership not found");
  }


  if (membership.organizationId !== organizationId) {
    logger.warn("membership does not belong to this organization");
    throw new AuthorizationError("membership does not belong to this organization");
  }

  
  if (membership.role === "OWNER") {
   logger.warn("owner cannot be removed");
   throw new AuthorizationError("owner cannot be removed");
  }

 
  if (membership.userId === currentUserId) {
   logger.warn("use leave organization route instead");
   throw new ValidationError("use leave organization route instead");
  }

  await membershipRepo.delete(undefined, membershipId);

  logger.info({
    membership : membershipId
  }, "member removed successfully");

  return {
    success: true,
    statusCode: 200,
    message: "member removed successfully",
  };
};
