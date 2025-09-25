import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  password: z
    .string()
    .min(1, "Password is required"),
  
  rememberMe: z
    .boolean()
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;