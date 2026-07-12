import { AuthorizationError } from "../errors/AuthorizationError.js";
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
      throw new AuthorizationError("not a member");
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
