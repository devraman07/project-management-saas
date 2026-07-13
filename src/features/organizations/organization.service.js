import { NotFoundError } from "../../errors/NotFoundError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { logger } from "../../shared/logger/logger.js";
import { logActivity } from "../../shared/utils/activity/Logger.js";
import { createOrganizationTransaction } from "../../transactions/organization.transaction.js";
import { organizationRepo } from "./organizations.repository.js";

export const createOrganizationService = async (organizationData, user) => {
  const { organization, ownerMembership } = await createOrganizationTransaction(
    organizationData,
    user,
  );

  await logActivity({
    organizationId: organization.id,

    actorMembershipId: ownerMembership.id,

    action: "ORGANIZATION_CREATED",

    entityType: "ORGANIZATION",

    entityId: organization.id,

    metadata: {
      organizationName: organization.name,
    },
  });

  logger.info(
    {
      organizationId: organization.id,
      ownerMembershipId: ownerMembership.id,
      ownerUserId: user.id,
    },
    "Organization created successfully",
  );

  return {
    success: true,
    statusCode: 201,
    organization,
    message: "Organization created successfully",
  };
};

export const getOrgService = async (user) => {
  const result = await organizationRepo.findAllByCreator(undefined, user.id);

  if (result.length === 0) {
    throw new NotFoundError("organization not found");
  }

  logger.info(
    {
      result: result,
    },
    "get organization route hit successfull",
  );
  return {
    success: true,
    statusCode: 200,
    organizations: result,
    message: "all organizations found",
  };
};

export const singleOrgService = async (id) => {
  const result = await organizationRepo.findById(undefined, id);

  if (!result) {
    throw new NotFoundError("organization not found");
  }

  logger.info(
    {
      org: result,
    },
    "single organization route hit successfully",
  );
  return {
    success: true,
    statusCode: 200,
    organization: result,
    message: "organization found",
  };
};

export const updateOrgService = async (id, organizationData, user) => {
  const organization = await organizationRepo.findById(undefined, id);

  if (!organization) {
    throw new ValidationError("using wrong id");
  }

  const Duplicate = await organizationRepo.findDuplicateForUpdate(
    undefined,
    id,
    organizationData.name,
    user.id,
  );

  if (Duplicate) {
    throw new ValidationError("new data required for updation");
  }

  const updatedOrg = await organizationRepo.update(
    undefined,
    id,
    organizationData,
  );

  logger.info(
    {
      org: updatedOrg,
    },
    "organization updated successfully",
  );

  return {
    success: true,
    statuCode: 200,
    organization: updatedOrg,
    message: "organization name updated successfully",
  };
};

export const deleteOrgService = async (id) => {
  const existingOrg = await organizationRepo.findById(undefined, id);

  if (!existingOrg) {
    throw new NotFoundError("no organization found");
  }

  const deletedOrg = await organizationRepo.softDelete(undefined, id);

  logger.info(
    {
      org: deletedOrg,
    },
    "organization deleted successfully",
  );

  return {
    success: true,
    statusCode: 200,
    message: "Organization Moved to Bin",
  };
};
