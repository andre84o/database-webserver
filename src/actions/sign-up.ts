"use server";
import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";

export const SignUp = async (formdata: FormData) => {
  const userdata = {
    email: formdata.get('email') as string,
    username: formdata.get('username') as string,
    password: formdata.get('password') as string,
  };

  const supabase = await createClient();

  const {data: {user}, error} =await supabase.auth.signUp({
    email: userdata.email,
    password: userdata.password,
    options: {
      data: {
        username: userdata.username,
      },
    },
  });


  if (user && user.email) {
    const {data, error} = await supabase.from("users").insert([{id:user.id, email: user.email, username: userdata.username}]);
  }

  if (error) throw error;

  redirect("/");
};
