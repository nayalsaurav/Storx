import * as z from "zod";

export const signInSchema = z.object({
  identifier: z
    .email({ error: "Please enter a valid email" })
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(1, { error: "password is required" })
    .min(8, { error: "Password must be atleast 8 characters" }),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
