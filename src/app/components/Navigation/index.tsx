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
    <nav className="bg-transparent p-4 hidden md:block">
      <ul className="flex space-x-4">
        {links.map(({ href, label }) => {
          if (href === "/create" && !isLoggedIn) return null;

          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`${
                  isActive ? "text-amber-400 font-semibold" : "text-[#735BFD]"
                } hover:text-[#8B64FE]`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
