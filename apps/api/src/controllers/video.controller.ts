import { Request, Response } from "express";
export const getAllUserVideo = (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Here your all videos",
    videos: [],
  });
};
