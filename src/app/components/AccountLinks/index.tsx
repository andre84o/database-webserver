import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <div>
      {user ?
        <>
          <Link className="button-tertiary" href="/create">
            Create Post
          </Link>

          <LogOutButton />
        </>
      : 
        <Link className="button-primary" href="auth/login">
          Log In
        </Link>
      }
    </div>
  );
};

export default AccountLinks;
