'use client'
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { createClient } from "@/utils/supabase/browser.client";
import { Menu, X, Home, Plus, Info, LogIn } from "lucide-react";
import LogOutButton from "@/app/components/AccountLinks/LogOutButton";

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

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("id", "mobile-nav-portal");
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const toggleButton = (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open ? "true" : "false"}
      onClick={() => setOpen((v) => !v)}
      className="md:hidden p-2 rounded-md bg-white border border-neutral-200 text-neutral-700 hover:bg-slate-50"
    >
      {open ? <X size={18} /> : <Menu size={18} />}
    </button>
  );

  const panel = (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} z-[99999]`}
        onClick={() => setOpen(false)}
      />
      <aside ref={panelRef} role="dialog" aria-modal="true" className={`fixed inset-0 z-[99999] pointer-events-none`}>
        <div className={`absolute inset-0 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="absolute right-0 top-10 h-[calc(100vh-4rem)] w-[min(85vw,320px)] bg-white shadow-lg flex flex-col p-4 overflow-y-auto pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">Menu</div>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md text-neutral-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-auto">
              <ul className="flex flex-col gap-3">
                {links.map(({ href, label, Icon, auth }: any) => {
                  if (auth && !isLoggedIn) return null;
                  return (
                    <li key={href}>
                      <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50" onClick={() => setOpen(false)}>
                        <Icon size={18} className="text-neutral-600" />
                        <span className="font-medium text-neutral-900">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-4 border-t pt-4 px-1 space-y-2">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link href="/create" className="flex items-center gap-3 p-3 rounded-md bg-neutral-900 text-white justify-center">
                    <Plus size={16} />
                    <span>Create Post</span>
                  </Link>

                  <div>
                    <LogOutButton className="w-full">
                      <div className="flex items-center gap-3 justify-center w-full p-3 rounded-md border border-neutral-200 hover:bg-slate-50">
                        <LogIn size={16} className="transform rotate-180" />
                        <span>Log out</span>
                      </div>
                    </LogOutButton>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-3 p-3 rounded-md border border-neutral-200 justify-center">
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {toggleButton}
      {portalEl ? createPortal(panel, portalEl) : panel}
    </>
  );
};

export default MobileNav;
