import { db } from "../../configs/db.js";
import { conflictError } from "../../errors/conflictError.js";

import { membershipRepo } from "../memberships/membership.repository.js";
import { organizationRepo } from "./organizations.repository.js";

export const createOrganizationTransaction = async (
  organizationData,
  user,
) => {
  return await db.transaction(async (tx) => {
    const existingOrganization =
      await organizationRepo.findByNameAndCreator(
        tx,
        organizationData.name,
        user.id,
      );

    if (existingOrganization) {
      throw new conflictError("Organization already exists");
    }

    const organization = await organizationRepo.create(tx, {
      name: organizationData.name,
      createdBy: user.id,
    });

    const ownerMembership =
      await membershipRepo.createMembership(tx, {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
        status: "ACTIVE",
        invitedBy: null,
      });

    return {
      organization,
      ownerMembership,
    };
  });
};