import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  createOrganizationService,
  deleteOrgService,
  getOrgService,
  singleOrgService,
  updateOrgService,
} from "./organization.service.js";
import { createOrgTransformer } from "./organization.transformer.js";

export const createOrgController = asyncHandler(async (req, res) => {
  const organizationData = createOrgTransformer(req.body);

  const result = await createOrganizationService(organizationData, req.user);

  return res.status(result.statusCode).json({
    success: true,
    organization: result.organization,
    message: result.message,
  });
});

export const getMyOwnedOrgController = asyncHandler(async (req, res) => {
  const result = await getOrgService(req.user);

  return res.status(result.statusCode).json({
    success: true,
    organizations: result.organizations,
    message: result.message,
  });
});

export const singleOrgController = asyncHandler(async (req, res) => {
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
});

export const updateOrgController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationData = createOrgTransformer(req.body);

  const result = await updateOrgService(id, organizationData, req.user);

  return res.status(200).json({
    success: true,
    organization: result.organization,
    message: result.message,
  });
});

export const deleteOrgController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteOrgService(id);

  return res.status(result.statusCode).json({
    success: true,
    message: result.message,
  });
});
