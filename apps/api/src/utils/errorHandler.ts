import { Response } from "express";

export const errorHandler = (
  res: Response,
  status: number,
  message: string | Record<string, string>,
) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
