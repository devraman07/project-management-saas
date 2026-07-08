import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";

import { createOrgValidator } from "./organization.validator.js";
import {
  createOrgController,
  deleteOrgController,
  getMyOwnedOrgController,
  singleOrgController,
  updateOrgController,
} from "./organization.controller.js";
import { organizationMemberShipRouter } from "../memberships/organizationMembership.js";
import { projectOrganizationRouter } from "../projects/projectOrganization.routes.js";
import {organizationInviteRouter} from "../Invites/OrgInvites.routes.js";

export const orgRouter = express.Router();

orgRouter.post("/", authMiddleware, createOrgValidator, createOrgController);

orgRouter.get("/", authMiddleware, getMyOwnedOrgController);
orgRouter.patch(
  "/:id",
  authMiddleware,
  createOrgValidator,
  updateOrgController,
);

orgRouter.delete("/:id", authMiddleware, deleteOrgController);
orgRouter.get("/:id", authMiddleware, singleOrgController);
orgRouter.use("/:organizationId/members", organizationMemberShipRouter);
orgRouter.use("/:organizationId/projects", projectOrganizationRouter);
orgRouter.use("/:organizationId/invites", organizationInviteRouter);