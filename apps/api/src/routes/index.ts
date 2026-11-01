import { Router } from "express";
import { videoRouter } from "./video.route.js";
import { userRouter } from "./user.route.js";

export const router = Router();

router.use("/video", videoRouter);
router.use("/user", userRouter);
