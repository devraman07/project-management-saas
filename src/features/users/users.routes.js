import express from "express";
import { authMiddleware } from "../../middlewares/auth.middileware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { deleteUserController, getusersController, profileController, updateUserController } from "./users.controller.js";
import { ownerShipCheck } from "../../middlewares/ownership.middleware.js";
import { updateUserTransformer } from "./users.transformers.js";
import { updateUserValidator } from "./users.validators.js";
import { ownerOrAdmincheck } from "../../middlewares/ownerOradmin.middleware.js";




export const userRouter = express.Router();


userRouter.get("/", authMiddleware, roleMiddleware("admin"),  getusersController);
userRouter.get("/profile", authMiddleware, profileController);
userRouter.patch("/profile/:id", authMiddleware, ownerShipCheck, updateUserTransformer, updateUserValidator, updateUserController);
userRouter.delete("/profile/:id", authMiddleware, ownerOrAdmincheck, deleteUserController);