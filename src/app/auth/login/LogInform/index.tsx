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
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold mb-2 text-neutral-900">Welcome back</h2>
        <p className="text-sm text-neutral-600 mb-6">Log in to continue to your dashboard</p>

        <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-neutral-600 block mb-2">Email</label>
            <input
              {...register("email")}
              id="email"
              name="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#735BFD]"
            />
            {errors.email && <ErrorMessage message={errors.email.message!} />}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-neutral-600 block mb-2">Password</label>
            <input
              {...register("password")}
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              className="w-full rounded-md border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#735BFD]"
            />
            {errors.password && <ErrorMessage message={errors.password.message as string} />}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isPending} className="w-full button-primary">
              {isPending ? "Logging you in..." : "Sign in"}
            </button>
          </div>
        </form>

        {error && "message" in error && (
          <div className="mt-4">
            <ErrorMessage message={(error as any).message} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;