"use client";

import { useTransition } from "react";
import { LogOut } from "@/actions/log-out";

export default function LogOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={async () => {
        startTransition(() => {});
        await LogOut();
      }}
    >
      <button
        type="submit"
        className="button-secondary cursor-pointer hover:bg-blue-300"
        disabled={pending}
      >
        {pending ? "Logging out..." : "Log Out"}
      </button>
    </form>
  );
}
