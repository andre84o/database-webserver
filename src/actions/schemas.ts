import { z } from "zod";

export const logInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "You must enter a password with at least 6 characters"),
});

export const signUpSchema = z.object({
    email: z.email(),
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});