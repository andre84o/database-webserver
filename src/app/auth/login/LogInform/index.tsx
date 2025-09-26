// Fil: app/auth/login/LoginForm.tsx
"use client";

import { LogIn } from "@/actions/log-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInSchema } from "@/actions/schemas";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";

export default function LoginForm() {
  // ✅ Hooks ska ligga inuti komponenten
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(logInSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: LogIn,
  });

  // ✅ All JSX återvänder från komponenten, inget “lösryckt” efteråt
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
          {/* Förklaring: visar valideringsfel för email */}
          {errors.email && (
            <ErrorMessage message={errors.email.message as string} />
          )}
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
          {/* Förklaring: visar valideringsfel för password */}
          {errors.password && (
            <ErrorMessage message={errors.password.message as string} />
          )}
        </fieldset>

        <button
          className="button-secondary w-1/2 m-auto mb-4"
          disabled={isPending}
        >
          {/* Förklaring: visar laddtext när mutation pågår */}
          {isPending ? "Logging you in!" : "Log in!"}
        </button>
      </form>

      {/* Förklaring: visar ev. fel från mutation */}
      {error && "message" in error && (
        <ErrorMessage message={(error as any).message} />
      )}
    </>
  );
}
