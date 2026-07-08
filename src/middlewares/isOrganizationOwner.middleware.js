import { organizationRepo } from "../features/organizations/organizations.repository.js";

export const isOrganizationOwner = async (
  req,
  res,
  next
) => {
  try {
    const { organizationId } = req.params;

    const organization =
      await organizationRepo.findById(
        undefined,
        organizationId
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "organization not found",
      });
    }

    if (
      organization.createdBy !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "only organization owner can perform this action",
      });
    }

    req.organization = organization;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message:
        "error inside organization owner middleware",
    });
  }
};