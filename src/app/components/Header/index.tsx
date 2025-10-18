import Link from "next/link";
import Logo from "../Logo";
import AccountLinks from "../AccountLinks";
import MobileNav from "../MobileNav";
import { createClient } from "@/utils/supabase/server-client";
import Navigation from "../Navigation";

export default async function Header() {
  let signedIn = false;
  let userEmail: string | null = null;
  let username: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = !!data.user;
    userEmail = data.user?.email ?? null;

    if (data.user?.id) {
      const { data: u } = await supabase
        .from("users")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();
      username = (u as any)?.username ?? null;
    }
  } catch {
    signedIn = false;
  }

  return (
    <header className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] bg-neutral-50/60 backdrop-blur-sm border-b border-neutral-200">
      {signedIn && (
        <div
          className="
      pointer-events-none select-none
      absolute bottom-1 left-2 md:hidden  /* Svenska: bara mobil */
      z-10 text-xs sm:text-sm text-gray-400 whitespace-nowrap
    "
        >
          ID: {username ?? userEmail}
        </div>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:pl-6">
          <div className="block md:hidden">
            <Logo />
          </div>

          <div className="hidden md:block">
            <div className="bg-gray-200/10 rounded-full shadow-lg -translate-y-5 shadow-[#735BFD]">
              <Logo />
            </div>
          </div>
        </div>
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <div className="max-w-3xl">
            <Navigation />
          </div>
        </div>
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
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
