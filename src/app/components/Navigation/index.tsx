"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/browser.client";

const Navigation = () => {
  const pathname = usePathname();
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => sub?.subscription?.unsubscribe();
  }, [supabase]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="hidden md:flex items-center p-2">
      <div className="rounded-full bg-white/60 backdrop-blur-sm shadow-sm border border-neutral-100 px-4 py-2">
        <ul className="flex items-center gap-6">
          {links.map(({ href, label }) => {
            if (href === "/create" && !isLoggedIn) return null;

            const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-neutral-900 font-semibold bg-gradient-to-br from-[#fff8] via-[#fff4] to-[#fff2] shadow-sm'
                      : 'text-[#4b3edb] hover:text-[#3427d9]'
                  }`}
                >
                  <span className="leading-none">{label}</span>
                </Link>

                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#8B64FE] to-[#5E4EFD] rounded-full shadow-[0_6px_18px_rgba(115,91,253,0.12)]" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
