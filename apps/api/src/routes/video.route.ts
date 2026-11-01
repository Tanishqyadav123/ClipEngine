import { Request, Response, Router } from "express";
import {
  getAllUserVideo,
  initializeVideoUploadService,
  completeVideoUploadController,
} from "../controllers/video.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const videoRouter = Router();

// Endpoint for initialize the upload :-
videoRouter.post("/initialize", authMiddleware, initializeVideoUploadService);
videoRouter.post(
  "/complete-upload",
  authMiddleware,
  completeVideoUploadController,
);
videoRouter.get("/all", getAllUserVideo);
