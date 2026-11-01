import { z, ZodObject } from "zod";
import { errorHandler } from "./errorHandler.js";
import { Response } from "express";

export const validateHandler = (
  res: Response,
  schema: ZodObject,
  payload: Record<string, unknown>,
) => {
  const { success, error, data } = z.safeParse(schema, payload);

  if (!success) {
    console.log(error.flatten().fieldErrors);
    let errorObj: { [key: string]: string[] | undefined } =
      error.flatten().fieldErrors;

    let keyArr: string[] = Object.keys(errorObj);
    let valArr = Object.values(errorObj);

    let buildError: { [key: string]: string } = {};

    for (let i = 0; i < keyArr.length; i++) {
      buildError[keyArr[i]] = valArr[i]!.join(" ");
    }

    console.log(buildError);
    return { success, response: errorHandler(res, 400, buildError) };
  }

  return {
    success,
    response: data,
  };
};
