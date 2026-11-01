import { Request, response, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import { signInUserSchema, signUpUserSchema } from "@repo/validation";
import { validateHandler } from "../utils/validationHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  checkUserAlreadyExist,
  createNewUser,
  getUserProfileDetails,
} from "../repository/user.repo.js";
import { errorHandler } from "../utils/errorHandler.js";
import z from "zod";

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const validResponse = validateHandler(res, signUpUserSchema, req.body);

    if (validResponse && !validResponse["success"]) {
      return validResponse.response;
    }

    const response = validResponse.response as z.infer<typeof signUpUserSchema>;
    const { email, password, username } = response;

    // check for email or username already exist or not :-
    const userExist = await checkUserAlreadyExist({
      username: username,
      email: email,
    });

    if (userExist?.id) {
      return errorHandler(res, 400, "User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user :-
    const newUser = await createNewUser({
      email: email,
      username: username,
      password: hashedPassword,
    });

    const { password: _, ...safeUser } = newUser;
    return responseHandler(res, 201, "User created successfully", safeUser);
  },
);

export const signinController = asyncHandler(
  async (req: Request, res: Response) => {
    const validResponse = validateHandler(res, signInUserSchema, req.body);

    if (validResponse && !validResponse["success"]) {
      return validResponse.response;
    }

    const response = validResponse.response as z.infer<typeof signInUserSchema>;
    const { password, username } = response;

    // check for email or username already exist or not :-
    const userExist = await checkUserAlreadyExist({
      username: username,
    });

    if (!userExist?.id) {
      return errorHandler(res, 400, "Invalid Credentails");
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return errorHandler(res, 400, "Invalid Credentails");
    }

    // Generate the token :-

    const token = jwt.sign(
      {
        sub: userExist.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: 3600,
      },
    );
    return responseHandler(res, 200, "User LoggedIn successfully", { token });
  },
);

export const getMyProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return errorHandler(res, 404, "User id not found");
    }

    // Getting user Profile Details :-

    const userDetails = await getUserProfileDetails(userId);

    if (!userDetails) {
      return errorHandler(res, 404, "User details not found");
    }
    return responseHandler(res, 200, "User Details", userDetails);
  },
);
