import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import {
  addMemberController,
  getMembersController,
  removeMemberController,
  updateMemberRoleController,
} from "./membership.controller.js";
import { checkIsOrgMember } from "../../middlewares/isOrganizationMember.middleware.js";
import { isOrganizationOwner } from "../../middlewares/isOrganizationOwner.middleware.js";

export const organizationMemberShipRouter = express.Router({
  mergeParams: true,
});

organizationMemberShipRouter.get(
  "/",
  authMiddleware,
  checkIsOrgMember,
  getMembersController,
);

organizationMemberShipRouter.patch(
  "/:membershipId/role",
  authMiddleware,
  isOrganizationOwner,
  updateMemberRoleController,
);

organizationMemberShipRouter.post(
  "/",
  authMiddleware,
  isOrganizationOwner,
  addMemberController,
);

organizationMemberShipRouter.delete(
  "/:membershipId",
  authMiddleware,
  isOrganizationOwner,
  removeMemberController
);
