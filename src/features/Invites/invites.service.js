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
      logger.warn("User is already a member");
      throw new conflictError("User is already a member of this organization");
    }
  }

  
  const existingInvite = await InviteRepo.findPendingByEmailAndOrg(
    undefined,
    email,
    organizationId,
  );

  if (existingInvite) {
    logger.warn("Pending invite already exists");
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
    organizationId,
    actorMembershipId: invitedByMembershipId,
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
      inviteId: invite.id,
      organizationId,
      invitedEmail: invite.invitedEmail,
      role: invite.roleToAssign,
      invitedByMembershipId,
    },
    "Invite created successfully",
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
    throw new NotFoundError("Invite not found");
  }

  if (invite.status !== "PENDING") {
    logger.warn(
      {
        inviteId: invite.id,
      },
      "Invite no longer pending",
    );

    throw new ValidationError("Invite no longer exists");
  }

  if (new Date(invite.expiresAt) < new Date()) {
    logger.warn(
      {
        inviteId: invite.id,
      },
      "Trying to accept expired invite",
    );

    throw new ValidationError("Invite has expired");
  }

  const user = await userrepo.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.email !== invite.invitedEmail) {
    logger.warn(
      {
        userId,
        inviteId: invite.id,
      },
      "Invite email mismatch",
    );

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
    logger.warn(
      {
        userId,
        organizationId: invite.organizationId,
      },
      "User already belongs to organization",
    );

    throw new conflictError("User is already a member");
  }

  // ✅ Transaction
  const { membership, invite: updatedInvite } = await acceptInviteTransacion({
    invite,
    user,
  });

  // ✅ Activity
  await logActivity({
    organizationId: updatedInvite.organizationId,

    actorMembershipId: membership.id,

    action: "INVITE_ACCEPTED",

    entityType: "INVITE",

    entityId: updatedInvite.id,

    metadata: {
      invitedEmail: updatedInvite.invitedEmail,
      role: updatedInvite.roleToAssign,
    },
  });

  // ✅ Logger
  logger.info(
    {
      membershipId: membership.id,
      organizationId: membership.organizationId,
      inviteId: updatedInvite.id,
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
