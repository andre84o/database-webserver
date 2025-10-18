"use client";

import { useTransition } from "react";
import { LogOut } from "@/actions/log-out";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function LogOutButton({ className = '', children }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={async () => {
        startTransition(() => {});
        await LogOut();
      }}
    >
      <button type="submit" className={`${className} cursor-pointer`} disabled={pending}>
        {pending ? "Logging out..." : children ?? "Log Out"}
      </button>
    </form>
  );
}
