import { Response } from "express";

export const responseHandler = (
  res: Response,
  status: number,
  message: string,
  data?: any,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
