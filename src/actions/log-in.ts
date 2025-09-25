"use server";

import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";

export const LogIn = async (formdata: FormData) => {
  const userdata = {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string,
  };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(userdata);
  if (error) throw error;

  redirect("/");
};
