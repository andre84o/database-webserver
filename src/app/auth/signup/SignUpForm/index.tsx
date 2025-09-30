'use client'

import { SignUp } from "@/actions/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/actions/schemas";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { de } from "zod/locales";

const SignUpForm = () => {
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: SignUp,
  })
  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="flex flex-col mb-4"
    >
      <h2>Sign up</h2>

      <fieldset>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          {...register("email")}
          name="email"
          id="email"
          className="border-1 rounded-md p-2 w-full"
        />
      </fieldset>
      <fieldset>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          {...register("username")}
          id="username"
          className="border-1 rounded-md p-2 w-full"
        />
      </fieldset>
      <fieldset>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          {...register("password")}
          id="password"
          className="border-1 rounded-md p-2 w-full"
        />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white rounded-md p-2 mt-4 w-full"
      >
        {isPending ? "Signing you up!" : "Sign up!"}
      </button>
    </form>
  );
};

export default SignUpForm;
