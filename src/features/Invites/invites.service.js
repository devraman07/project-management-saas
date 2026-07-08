import crypto from "crypto";

import { userrepo } from "../users/users.repoitory.js";
import { membershipRepo } from "../memberships/membership.repository.js";
import { InviteRepo } from "./invites.reposiory.js";
import { emailQueue } from "../../jobs/queues/email.queue.js";

export const createInviteService = async (
  organizationId,
  email,
  role,
  invitedByMembershipId
) => {
  const user = await userrepo.findByEmail(email);

  // Existing user already a member?
  if (user) {
    const existingMembership =
      await membershipRepo.findAllByUserAndOrg(
        undefined,
        user.id,
        organizationId
      );

    if (existingMembership) {
      return {
        success: false,
        statusCode: 409,
        message:
          "User is already a member of this organization",
      };
    }
  }

  // Existing pending invite?
  const existingInvite =
    await InviteRepo.findPendingByEmailAndOrg(
      undefined,
      email,
      organizationId
    );

  if (existingInvite) {
    return {
      success: false,
      statusCode: 409,
      message:
        "Pending invite already exists",
    };
  }

  const token =
    crypto.randomBytes(32).toString("hex");

  const invite =
    await InviteRepo.create(undefined, {
      organizationId,
      invitedEmail: email,
      roleToAssign: role,
      token,
      invitedBy: invitedByMembershipId,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

  await emailQueue.add("invite-email", {
    email,
    token,
    organizationId,
    role,
  });

  return {
    success: true,
    statusCode: 201,
    invite,
    message:
      "Invite created and email sent successfully",
  };
};

export const getInviteByTokenService =
  async (token) => {
    const invite =
      await InviteRepo.findByToken(
        undefined,
        token
      );

    if (!invite) {
      return {
        success: false,
        statusCode: 404,
        message: "Invite not found",
      };
    }

    if (invite.status !== "PENDING") {
      return {
        success: false,
        statusCode: 400,
        message:
          "Invite is no longer active",
      };
    }

    if (
      new Date(invite.expiresAt) <
      new Date()
    ) {
      return {
        success: false,
        statusCode: 400,
        message:
          "Invite has expired",
      };
    }

    return {
      success: true,
      statusCode: 200,
      invite,
      message:
        "Invite fetched successfully",
    };
};

export const acceptInviteservice =
  async (token, userId) => {
    const invite =
      await InviteRepo.findByToken(
        undefined,
        token
      );

    if (!invite) {
      return {
        success: false,
        statusCode: 404,
        message: "Invite not found",
      };
    }

    if (invite.status !== "PENDING") {
      return {
        success: false,
        statusCode: 400,
        message:
          "Invite is no longer active",
      };
    }

    if (
      new Date(invite.expiresAt) <
      new Date()
    ) {
      return {
        success: false,
        statusCode: 400,
        message:
          "Invite has expired",
      };
    }

    const user =
      await userrepo.findById(userId);

    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    }

    if (
      user.email !==
      invite.invitedEmail
    ) {
      return {
        success: false,
        statusCode: 403,
        message:
          "This invite belongs to another email address",
      };
    }

    const existingMembership =
      await membershipRepo.findAllByUserAndOrg(
        undefined,
        user.id,
        invite.organizationId
      );

    if (existingMembership) {
      return {
        success: false,
        statusCode: 409,
        message:
          "User is already a member",
      };
    }

    // Convert membership id -> user id
    let inviterUserId = null;

    if (invite.invitedBy) {
      const inviterMembership =
        await membershipRepo.findById(
          undefined,
          invite.invitedBy
        );

      inviterUserId =
        inviterMembership?.userId ??
        null;
    }

    const membership =
      await membershipRepo.createMembership(
        undefined,
        {
          userId: user.id,
          organizationId:
            invite.organizationId,
          role: invite.roleToAssign,
          invitedBy:
            inviterUserId,
        }
      );

    await InviteRepo.updateStatus(
      undefined,
      invite.id,
      "ACCEPTED"
    );

    return {
      success: true,
      statusCode: 201,
      membership,
      message:
        "Invite accepted successfully",
    };
};