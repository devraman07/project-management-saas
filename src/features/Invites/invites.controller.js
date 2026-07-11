import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  createInviteService,
  getInviteByTokenService,
  acceptInviteservice,
} from "./invites.service.js";

export const createInviteController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, role } = req.body;

  const invitedByMembershipId = req.membership.id;

  const result = await createInviteService(
    organizationId,
    email,
    role,
    invitedByMembershipId,
  );

  return res.status(result.statusCode).json({
    success: true,
    invite: result.invite,
    message: result.message,
  });
});

export const getInviteByTokenController = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const result = await getInviteByTokenService(token);

  return res.status(result.statusCode).json({
    success: true,
    invite: result.invite,
    message: result.message,
  });
});

export const acceptInviteController = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const result = await acceptInviteservice(token, req.user.id);

  return res.status(result.statusCode).json({
    success: true,
    membership: result.membership,
    message: result.message,
  });
});
