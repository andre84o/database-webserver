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
  } catch (e) {
    signedIn = false;
  }

  return (
    <header className="w-full bg-neutral-50/60 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
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
    </header>
  );
}
