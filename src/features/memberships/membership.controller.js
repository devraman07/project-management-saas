import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { membershipRepo } from "./membership.repository.js";
import {
  addMemberService,
  deleteMymembershipService,
  getMemberService,
  getMyMbershipService,
  removeMemberService,
  updateMemberRoleService,
} from "./membership.service.js";

export const getMembersController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const result = await getMemberService(organizationId);

  return res.status(result.statusCode).json({
    success: true,
    members: result.members,
    message: result.message,
  });
});

export const myMembershipsController = asyncHandler(async (req, res) => {
  const result = await getMyMbershipService(req.user);

  return res.status(result.statusCode).json({
    success: true,
    memberships: result.memberships,
    message: result.message,
  });
});

export const deleteMyMembershipController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const result = await deleteMymembershipService(req.user.id, organizationId);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});

export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { organizationId, membershipId } = req.params;

  const { role } = req.body;

  const result = await updateMemberRoleService(
    organizationId,
    membershipId,
    role,
  );

  return res.status(result.statusCode).json({
    success: true,
    membership: result.membership,
    message: result.message,
  });
});

export const addMemberController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const { email, role } = req.body;

  const result = await addMemberService(
    organizationId,
    email,
    role,
    req.user.id,
  );

  return res.status(result.statusCode).json({
    success: true,
    membership: result.membership,
    message: result.message,
  });
});

export const removeMemberController = asyncHandler(async (req, res) => {
  const { organizationId, membershipId } = req.params;

  const result = await removeMemberService(
    organizationId,
    membershipId,
    req.user.id,
  );

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});
