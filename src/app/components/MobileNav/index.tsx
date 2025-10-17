'use client'
import Hamburger from "hamburger-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/browser.client";


const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => sub?.subscription?.unsubscribe();
  }, [supabase]);

  const Links = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create" },
    { href: "/about", label: "About" },
  ];
  return (
    <nav className="bg-transparent p-4 md:block md:hidden">
      <Hamburger toggled={isOpen} toggle={setIsOpen} />
      {isOpen && (
        <ul className="flex flex-col space-y-4">
          {Links.map(({ href, label }) => {
            if (href === "/create" && !isLoggedIn) return null;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="text-gray-600 hover:text-gray-300 font-bold"
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};
export default MobileNav;
