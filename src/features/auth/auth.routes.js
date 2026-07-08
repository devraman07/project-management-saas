import express from "express";
import { loginTransformer, registerTransformer } from "./auth.tranformer.js";
import { loginValidator, registerVlaidator } from "./auth.validator.js";
import { loginController, logoutController, refreshController, registerController, userProfile } from "./auth.controller.js";
import { refreshMiddleware } from "../../middlewares/refresh.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middileware.js";




export const AuthRouter = express.Router();

AuthRouter.post('/register', registerTransformer, registerVlaidator, registerController);
AuthRouter.post("/login",  loginTransformer, loginValidator, loginController);
AuthRouter.post("/refresh", refreshMiddleware, refreshController);
AuthRouter.post("/logout", logoutController);
AuthRouter.get("/profile", authMiddleware, userProfile);
