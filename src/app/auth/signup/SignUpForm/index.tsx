"use client";

import { SignUp } from "@/actions/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/actions/schemas";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: SignUp,
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center -mx-8 sm:mx-0">
      <div
        className="
          w-full
          max-w-lg       /* Svenska: bredare än md för mobil */
          sm:max-w-xl    /* Svenska: lite bredare på små till medel skärmar */
          lg:max-w-2xl   /* Svenska: bredare på stora skärmar */
          bg-white rounded-2xl shadow-2xl p-6
        "
      >
        <h2 className="text-2xl font-bold mb-2 text-neutral-900">
          Create your account
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          Enter your details to get started
        </p>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm text-neutral-600 block mb-2"
            >
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              name="email"
              id="email"
              className="w-full rounded-md border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#735BFD]"
              placeholder="you@company.com"
            />
            {errors.email && (
              <ErrorMessage message={errors.email.message as string} />
            )}
          </div>

          <div>
            <label
              htmlFor="username"
              className="text-sm text-neutral-600 block mb-2"
            >
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              id="username"
              className="w-full rounded-md border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#735BFD]"
              placeholder="Your username"
            />
            {errors.username && (
              <ErrorMessage message={errors.username.message as string} />
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm text-neutral-600 block mb-2"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              id="password"
              className="w-full rounded-md border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#735BFD]"
              placeholder="Choose a strong password"
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message as string} />
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full button-primary"
            >
              {isPending ? "Signing you up..." : "Create account"}
            </button>
          </div>
        </form>

        {error && typeof (error as any).message === "string" && (
          <div className="mt-4">
            <ErrorMessage message={(error as any).message} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
