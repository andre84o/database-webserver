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
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 hover:bg-slate-50"
          >
            <Plus size={16} />
            <span>Create Post</span>
          </Link>

          <LogOutButton>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 hover:bg-slate-50">
              <LogOut size={16} />
              <span>Log Out</span>
            </div>
          </LogOutButton>
        </>
      ) : (
        <Link className="button-primary" href="auth/login">
          Log In
        </Link>
      )}
    </div>
  );
};

export default AccountLinks;
