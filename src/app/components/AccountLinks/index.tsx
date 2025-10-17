import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
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
          <div className="text-sm text-gray-400">
            Signed in as {username ?? user.email}
          </div>
          <Link className="button-tertiary hover:bg-green-300" href="/create">
            Create Post
          </Link>

          <LogOutButton />
        </>
      ) : (
        <Link className="button-primary hover:bg-blue-300" href="auth/login">
          Log In
        </Link>
      )}
    </div>
  );
};

export default AccountLinks;
