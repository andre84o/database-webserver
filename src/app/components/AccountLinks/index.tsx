import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";
import { LogOut, Plus } from "lucide-react";

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user?.id) {
    const { data: u } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    username = (u as any)?.username ?? null;
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div
            className="
              absolute bottom-1 left-2
              md:left-auto md:right-2
              md:bottom-1
              z-10 text-xs sm:text-sm text-gray-400 whitespace-nowrap mr-5
            "
          >
            ID: {username ?? user.email}
          </div>

          <Link
            href="/create"
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#5E4EFD] hover:text-[#5E4EFD] hover:bg-slate-50"
          >
            <Plus size={16} />
            <span>Create Post</span>
          </Link>

          <LogOutButton>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#5E4EFD] hover:text-[#5E4EFD] hover:bg-slate-50">
              <LogOut size={16} />
              <span>Log Out</span>
            </div>
          </LogOutButton>
        </>
      ) : (
        <Link
          href="auth/login"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3m12 0l-4-4m4 4l-4 4"
            />
          </svg>
          <span>Log in</span>
        </Link>
      )}
    </div>
  );
};

export default AccountLinks;
