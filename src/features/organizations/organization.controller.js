import {
  createOrganizationService,
  deleteOrgService,
  getOrgService,
  singleOrgService,
  updateOrgService,
} from "./organization.service.js";
import { createOrgTransformer } from "./organization.transformer.js";

export const createOrgController = async (req, res) => {
  try {
    const organizationData = createOrgTransformer(req.body);

    const result = await createOrganizationService(organizationData, req.user);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      organization: result.organization,
      message: result.message,
    });
  } catch (error) {
    console.log(error);
    console.log(error.cause);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside create org controller",
    });
  }
};

export const getMyOwnedOrgController = async (req, res) => {
  try {
    const result = await getOrgService(req.user);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        organizations: [],
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      organizations: result.organizations,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get organizations controller",
    });
  }
};

export const singleOrgController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await singleOrgService(id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        organization: null,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      organization: result.organization,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside get organization by id controller",
    });
  }
};

export const updateOrgController = async (req, res) => {
  try {
    const {id} = req.params;
    const organizationData = createOrgTransformer(req.body);

    const result = await updateOrgService(
    
      id,
      organizationData,
      req.user,
    );
    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      organization: result.organization,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside update organization controller",
    });
  }
};



export const deleteOrgController  =  async (req, res) => {
  try {
     const {id} = req.params;

     const result = await deleteOrgService(id);

     if(!result.success) {
      return res.status(result.statusCode).json({
        success : false,
        message : result.message,
        org : [],
      })
     }

     return res.status(result.statusCode).json({
      success : true,
      message : result.message
     })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside delete organization controller",
    });
  }
}
