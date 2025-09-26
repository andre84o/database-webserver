import {z} from "zod";

export const logInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "You must enter a password with at least 6 characters").max(100),
});