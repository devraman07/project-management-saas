import { createOrganizationTransaction } from "./organization.transaction.js";
import { organizationRepo } from "./organizations.repository.js";

export const createOrganizationService = async (
  organizationData,
  user
) => {
  const organization =
    await createOrganizationTransaction(
      organizationData,
      user
    );

  return {
    success: true,
    statusCode: 201,
    organization,
    message: "organization created successfully",
  };
};

export const getOrgService = async (user) => {
  const result =
    await organizationRepo.findAllByCreator(
      undefined,
      user.id
    );

  if (result.length === 0) {
    return {
      success: false,
      statusCode: 404,
      message: "no organizations found",
    };
  }

  return {
    success: true,
    statusCode: 200,
    organizations: result,
    message: "all organizations found",
  };
};

export const singleOrgService = async (id) => {
  const result = await organizationRepo.findById(
    undefined,
    id
  );

  if (!result) {
    return {
      success: false,
      statusCode: 404,
      message: "organization not found",
    };
  }

  return {
    success: true,
    statusCode: 200,
    organization: result,
    message: "organization found",
  };
};

export const updateOrgService = async (id, organizationData, user) => {
   
    const organization = await organizationRepo.findById(undefined, id);

    if(!organization) {
        return {
            sucess : false,
        statusCode : 404,
        message : "wrong Id"
        };
    }

    const Duplicate = await organizationRepo.findDuplicateForUpdate(
        undefined, id, organizationData.name,
        user.id,
    )

    if(Duplicate) {
       return {
        success : false,
        statusCode : 409,
        message : "new data required for updation"
       }
    }

    const updatedOrg = await organizationRepo.update(undefined, id, organizationData);

    return {
        success : true,
        statuCode : 200,
        organization : updatedOrg,
        message : "organization name updated successfully",
    }

}



export const deleteOrgService = async (id) => {
    
  const existingOrg = await organizationRepo.findById(undefined, id);

  if(!existingOrg) {
    return {
      success : false,
      statusCode : 404,
      organizations : [],
      message : "No organization found",
    }
  }

  const deletedOrg = await organizationRepo.softDelete(undefined, id);

  return {
    success : true,
    statusCode : 200,
    message : "Organization Moved to Bin",
  }
  
}