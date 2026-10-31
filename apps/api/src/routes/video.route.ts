import { Router } from "express";
import { getAllUserVideo } from "../controllers/video.controller.js";

export const videoRouter = Router();

videoRouter.get("/all", getAllUserVideo);
