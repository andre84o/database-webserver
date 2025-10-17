'use client'
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/browser.client";
import { Menu, X, Home, Plus, Info, LogIn } from "lucide-react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => sub?.subscription?.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && open && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/create", label: "Create", Icon: Plus, auth: true },
    { href: "/about", label: "About", Icon: Info },
  ];

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md bg-white border border-neutral-200 text-neutral-700 hover:bg-slate-50"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 z-50 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"} w-[min(85vw,320px)] top-16 h-[calc(100vh-4rem)]`}
      >
        <div className="h-full bg-white shadow-lg flex flex-col p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold">Menu</div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md text-neutral-700 hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-auto">
            <ul className="flex flex-col gap-3">
              {links.map(({ href, label, Icon, auth }: any) => {
                if (auth && !isLoggedIn) return null;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={18} className="text-neutral-600" />
                      <span className="font-medium text-neutral-900">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 border-t pt-4 px-1">
            {isLoggedIn ? (
              <Link href="/create" className="block w-full text-center bg-neutral-900 text-white py-3 rounded-md">Create Post</Link>
            ) : (
              <Link href="/auth/login" className="block w-full text-center border border-neutral-200 py-3 rounded-md">Log in</Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
