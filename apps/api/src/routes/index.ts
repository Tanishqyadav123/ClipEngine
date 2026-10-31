import { Router } from "express";
import { videoRouter } from "./video.route.js";

export const router = Router();

router.use("/video", videoRouter);

