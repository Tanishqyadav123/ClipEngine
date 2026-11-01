import { dbClient } from "@repo/db/client";

export const checkUserAlreadyExist = async ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) => {
  return await dbClient.user.findUnique({
    where: {
      email,
      username,
    },
  });
};

export const createNewUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return await dbClient.user.create({
    data: data,
  });
};
export const getUserProfileDetails = async (id: string) => {
  return await dbClient.user.findUnique({
    where: {
      id,
    },
  });
};
