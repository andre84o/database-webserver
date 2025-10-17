"use client";

import { createClient } from '@/utils/supabase/browser.client';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInSchema } from "@/actions/schemas";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { de } from "zod/locales";

const LoginForm = () => {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(logInSchema)
  })

  const router = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: any) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      router.replace('/');
    }
  })

  return (
    <>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex flex-col"
      >
        <fieldset>
          <label htmlFor="email">Enter your email</label>
          <input
            className="ml-2 mb-4 px-2"
            {...register("email")}
            id="email"
            name="email"
            placeholder="Enter your email..."
          />
          {errors.email && <ErrorMessage message={errors.email.message!} />}
        </fieldset>

        <fieldset>
          <label htmlFor="password">Enter your password</label>
          <input
            type="password"
            className="ml-2 mb-4 px-2"
            {...register("password")}
            id="password"
            name="password"
            placeholder="Enter your password..."
          />
          {errors.password && (
            <ErrorMessage message={errors.password.message as string} />
          )}
        </fieldset>

        <button
          className="button-secondary w-1/2 m-auto mb-4"
          disabled={isPending}
        >
          {isPending ? "Logging you in!" : "Log in!"}
        </button>
      </form>
      {error && "message" in error && (
        <ErrorMessage message={(error as any).message} />
      )}
    </>
  );
}

export default LoginForm;