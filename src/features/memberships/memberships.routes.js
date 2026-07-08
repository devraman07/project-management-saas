import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { myMembershipsController } from "./membership.controller.js";


 export const memberShipRouter = express.Router({
  mergeParams: true,
});


memberShipRouter.get("/me", authMiddleware, myMembershipsController );
// memberShipRouter.delete("/:id");
// memberShipRouter.patch(":/id/role");




