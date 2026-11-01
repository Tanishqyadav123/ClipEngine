import { Router } from "express";
import {
  signinController,
  signupController,
  getMyProfileController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);
userRouter.get("/me", authMiddleware, getMyProfileController);
