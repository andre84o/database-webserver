"use server";

import { signUpSchema } from "./schemas";
import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import z from "zod";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {

  const supabase = await createClient();
  const { email, password, username } = userdata;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) throw error;

  if (!data?.user) {
    throw new Error("No user returned from sign up");
  }

  redirect("/");
};
