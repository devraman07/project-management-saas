import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { canManageProjectMiddleware } from "../../middlewares/canManageProjects.middleware.js";
import { createProjectController, getProjectsController } from "./project.controller.js";
import { createProjectValidator } from "./project.validator.js";
import { checkIsOrgMember } from "../../middlewares/isOrganizationMember.middleware.js";

export const projectOrganizationRouter = express.Router({
  mergeParams: true,
});

projectOrganizationRouter.post(
  "/",
  authMiddleware,
  createProjectValidator,
  checkIsOrgMember,
  canManageProjectMiddleware,
  createProjectController,
);

projectOrganizationRouter.get("/", authMiddleware,
  checkIsOrgMember,
  getProjectsController
);
