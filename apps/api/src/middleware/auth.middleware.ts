import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new Error("UnAuthorized Access Denied");
    }
    const token = header.split(" ")[1];

    const decoded: { sub?: string | undefined } = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    const { sub } = decoded;

    if (!sub) {
      throw new Error("Id in token not found");
    }

    req.userId = sub;

    next();
  } catch (error) {
    throw new Error("UnAuthorized Access Denied");
  }
};
