// POST /organizations/:organizationId/invites
// GET /organizations/:organizationId/invites
import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { checkIsOrgMember } from "../../middlewares/isOrganizationMember.middleware.js";
import { canManageProjectMiddleware } from "../../middlewares/canManageProjects.middleware.js";
import { createInviteController } from "./invites.controller.js";

export const organizationInviteRouter = express.Router({ mergeParams: true });

organizationInviteRouter.post(
  "/",
  authMiddleware,
  checkIsOrgMember,
  canManageProjectMiddleware,
  createInviteController,
);
