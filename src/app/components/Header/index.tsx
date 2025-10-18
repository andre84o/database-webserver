import Link from "next/link";
import Logo from "../Logo";
import AccountLinks from "../AccountLinks";
import SearchInput from "../Search";
import MobileNav from "../MobileNav";
import { createClient } from "@/utils/supabase/server-client";
import Navigation from "../Navigation";

export default async function Header() {
  let signedIn = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = !!data.user;
  } catch {
    signedIn = false;
  }

  return (
    <header className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] bg-neutral-50/60 backdrop-blur-sm border-b border-neutral-200">
      <div className="relative flex items-center">
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:pl-6">
          <Logo />
        </div>

        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Navigation />
            </div>

            <div className="flex-1 mx-6">
              <div className="max-w-xl mx-auto">
                <SearchInput />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MobileNav />
              <div className="hidden md:flex">
                <AccountLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
