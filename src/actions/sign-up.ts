"use server";

import { signUpSchema } from "./schemas";
import { createClient } from "@/utils/supabase/server-client";
import z from "zod";

type SignUpInput = z.infer<typeof signUpSchema>;

type SignUpResult =
  | { ok: true }
  | { ok: false; message: string };

export const SignUp = async (userdata: SignUpInput): Promise<SignUpResult> => {
  const parseResult = signUpSchema.safeParse(userdata);
  if (!parseResult.success) {
    return {
      ok: false,
      message: parseResult.error.issues[0]?.message ?? "Invalid sign up data",
    };
  }

  const supabase = await createClient();
  const { email, password, username } = parseResult.data;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      console.error("Supabase signUp error", error);
      return { ok: false, message: error.message ?? "Failed to create account" };
    }

    if (!data?.user) {
      return { ok: false, message: "No user returned from sign up" };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("SignUp action unexpected error", err);
    return {
      ok: false,
      message: String(err?.message ?? err ?? "Unknown error during sign up"),
    };
  }
};
