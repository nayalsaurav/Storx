import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.email().min(1, { error: "Email is required" }),
    password: z
      .string()
      .min(1, { error: "Password is required" })
      .min(8, { error: "Password should be minimum of 8 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "Password do not match",
    path: ["passwordConfirmation"],
  });

export type signUpSchemaType = z.infer<typeof signUpSchema>;
