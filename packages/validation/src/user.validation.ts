import z from "zod";

export const signUpUserSchema = z.object({
  username: z.string().nonempty().min(6),
  password: z.string().min(8),
  email: z.string().nonempty().includes("@"),
});

export const signInUserSchema = z.object({
  username: z.string().nonempty().min(6),
  password: z.string().min(8),
});
