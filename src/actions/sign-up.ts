"use server";

import { signUpSchema } from "./schemas";
import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import z from "zod";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {

  const supabase = await createClient();
  const {
    data: {user}, error} = await supabase.auth.signUp(userdata);

  

  if (error) throw error;

  redirect("/");
};
