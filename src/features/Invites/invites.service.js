import crypto from "crypto";

import { userrepo } from "../users/users.repoitory.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { InviteRepo } from "./invites.reposiory.js";
import { emailQueue } from "../../jobs/queues/email.queue.js";
import { conflictError } from "../../errors/conflictError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { AuthorizationError } from "../../errors/AuthorizationError.js";
import { logger } from "../../shared/logger/logger.js";
import { acceptInviteTransacion } from "../../transactions/Invite.transaction.js";
import { logActivity } from "../../shared/utils/activity/Logger.js";

export const createInviteService = async (
  organizationId,
  email,
  role,
  invitedByMembershipId,
) => {
  const user = await userrepo.findByEmail(email);

  if (user) {
    const existingMembership = await membershipRepo.findAllByUserAndOrg(
      undefined,
      user.id,
      organizationId,
    );

    if (existingMembership) {
      logger.warn("user is already a member");
      throw new conflictError("User is already a member of this organization");
    }
  }

  const existingInvite = await InviteRepo.findPendingByEmailAndOrg(
    undefined,
    email,
    organizationId,
  );

  if (existingInvite) {
    logger.warn("pneding invite already exists");
    throw new conflictError("Pending invite already exists");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invite = await InviteRepo.create(undefined, {
    organizationId,
    invitedEmail: email,
    roleToAssign: role,
    token,
    invitedBy: invitedByMembershipId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await emailQueue.add("invite-email", {
    email,
    token,
    organizationId,
    role,
  });

  await logActivity({
    organizationId: organizationId,

    actorMembershipId: user.id,

    action: "INVITE_SENT",

    entityType: "INVITE",

    entityId: invite.id,

    metadata: {
      email: invite.invitedEmail,
      role: invite.roleToAssign,
    },
  });

  logger.info(
    {
      invite: invite,
    },
    "invite created successfully",
  );

  return {
    success: true,
    statusCode: 201,
    invite,
    message: "Invite created and email sent successfully",
  };
};

export const getInviteByTokenService = async (token) => {
  const invite = await InviteRepo.findByToken(undefined, token);

  if (!invite) {
    throw new NotFoundError("invite not found");
  }

  if (invite.status !== "PENDING") {
    logger.warn("invite no longer exists");
    throw new ValidationError("invite no longer exist");
  }

  if (new Date(invite.expiresAt) < new Date()) {
    logger.warn("trying with expired invite");
    throw new ValidationError("invite expired");
  }

  return {
    success: true,
    statusCode: 200,
    invite,
    message: "Invite fetched successfully",
  };
};

export const acceptInviteservice = async (token, userId) => {
  const invite = await InviteRepo.findByToken(undefined, token);

  if (!invite) {
    throw new NotFoundError("invite not found");
  }

  if (invite.status !== "PENDING") {
    logger.warn("invite no longer exists");
    throw new ValidationError("invite no longer exist");
  }

  if (new Date(invite.expiresAt) < new Date()) {
    logger.warn("trying with expired invite");
    throw new ValidationError("Invite has expired");
  }

  const user = await userrepo.findById(userId);

  if (!user) {
    throw new NotFoundError("user not found");
  }

  if (user.email !== invite.invitedEmail) {
    logger.warn("trying with invalid  email id");
    throw new AuthorizationError(
      "This invite belongs to another email address",
    );
  }

  const existingMembership = await membershipRepo.findAllByUserAndOrg(
    undefined,
    user.id,
    invite.organizationId,
  );

  if (existingMembership) {
    logger.warn("existing member trying to join");
    throw new conflictError("User is already a member");
  }

  let inviterUserId = null;

  if (invite.invitedBy) {
    const inviterMembership = await membershipRepo.findById(
      undefined,
      invite.invitedBy,
    );

    inviterUserId = inviterMembership?.userId ?? null;
  }

  const membership = acceptInviteTransacion(invite, user);

  await logActivity({
    organizationId: invite.organizationId,
    actorMembershipId: membership.id,
    action: "INVITE_ACCEPTED",
    entityType: "INVITE",
    entityId: invite.id,
    metadata: {
      invitedEmail: invite.invitedEmail,
    },
  });

  logger.info(
    {
      membershipId: membership.id,
      organizationId: membership.organizationId,
      inviteId: invite.id,
    },
    "Invite accepted successfully",
  );

  return {
    success: true,
    statusCode: 201,
    membership,
    message: "Invite accepted successfully",
  };
};
