import { membershipRepo } from "../features/memberships/membership.repository.js";

export const checkIsOrgMember = async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    const memberShip = await membershipRepo.findAllByUserAndOrg(
      undefined,
      req.user.id,
      organizationId,
    );

   

    if (!memberShip) {
      return res.status(403).json({
        success: false,
        message: "not a member",

      });
    }

    req.membership = memberShip;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error inside is member check middleware",
    });
  }
};
