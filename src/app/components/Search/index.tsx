"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSearchPosts } from "@/utils/supabase/queries";
import Link from "next/link";
import { createPortal } from "react-dom";

function useDebouncedValue<T>(value: T, ms = 200) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export default function SearchInput(): React.ReactElement {
  const [userInput, setUserInput] = useState("");
  const debounced = useDebouncedValue(userInput, 250);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  const [portalReady, setPortalReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const mobileRootRef = useRef<HTMLDivElement | null>(null);
  const [mobilePortalReady, setMobilePortalReady] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { data, refetch } = useQuery({
    queryKey: ["search-results", debounced],
    queryFn: async () => {
      const term = String(debounced ?? "").trim();
      const { data, error } = await getSearchPosts(term);
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(debounced && String(debounced).trim().length >= 2),
  });

  const results = data ?? [];

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-search-portal", "1");
    el.style.position = "fixed";
    el.style.top = "-9999px";
    el.style.left = "0";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.visibility = "hidden";
    document.body.appendChild(el);
    portalRef.current = el;
    setPortalReady(true);

    return () => {
      if (portalRef.current?.parentElement) {
        portalRef.current.parentElement.removeChild(portalRef.current);
      }
      portalRef.current = null;
      setPortalReady(false);
    };
  }, []);
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-mobile-search-portal", "1");
    document.body.appendChild(el);
    mobileRootRef.current = el;
    setMobilePortalReady(true);
    return () => {
      if (mobileRootRef.current?.parentElement)
        mobileRootRef.current.parentElement.removeChild(mobileRootRef.current);
      mobileRootRef.current = null;
      setMobilePortalReady(false);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    try {
      mq.addEventListener?.("change", update);
    } catch {
      (mq as any).addListener?.(update);
    }
    return () => {
      try {
        mq.removeEventListener?.("change", update);
      } catch {
        (mq as any).removeListener?.(update);
      }
    };
  }, []);

  const applyPortalPosition = () => {
    if (!portalRef.current) return;
    const mobileButton = document.querySelector<HTMLElement>(
      '[data-testid="mobile-search-button"]'
    );
    const anchor =
      open && isMobile
        ? mobileButton ?? containerRef.current
        : inputRef.current ??
          (containerRef.current?.querySelector("input") as HTMLElement | null);

    if (!anchor) return;

    const rect = (anchor as HTMLElement).getBoundingClientRect();
    const el = portalRef.current;

    el.style.position = "fixed";
    el.style.zIndex = "99999";
    const top = rect.bottom + 8;
    el.style.top = `${top}px`;
    if (isMobile) {
      const margin = 12;
      el.style.left = `${margin}px`;
      el.style.right = `${margin}px`;
      el.style.width = `calc(100vw - ${margin * 2}px)`;
    } else {
      const left = Math.max(8, rect.left);
      const width = Math.min(rect.width, window.innerWidth - 32);
      el.style.left = `${left}px`;
      el.style.right = "";
      el.style.width = `${width}px`;
    }
    el.style.visibility = "visible";
  };
  useLayoutEffect(() => {
    if (open && portalReady) applyPortalPosition();
  }, [open, isMobile, portalReady, debounced, results.length]);

  useEffect(() => {
    const rerun = () => applyPortalPosition();
    if (open) {
      window.addEventListener("resize", rerun);
      window.addEventListener("scroll", rerun, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", rerun);
      window.removeEventListener("scroll", rerun);
    };
  }, [open, isMobile]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (portalRef.current && portalRef.current.contains(target)) return;
      setUserInput("");
      setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const excerpt = (s: string | null | undefined, n = 18) => {
    if (!s) return "";
    const words = String(s).split(/\s+/).filter(Boolean);
    return words.length <= n
      ? words.join(" ")
      : words.slice(0, n).join(" ") + "...";
  };

  const dropdown = (
    <div className="mt-2 w-full">
      {debounced && debounced.trim().length < 2 ? (
        <div className="bg-white border rounded-md p-3 text-sm text-neutral-500">
          Skriv minst 2 tecken för att söka
        </div>
      ) : null}

      {results && results.length > 0 && (
        <div className="bg-white border rounded-md overflow-hidden">
          {results.map((r: any) => (
            <Link
              href={`/${r.slug}`}
              key={r.slug}
              className="block p-3 hover:bg-slate-50 border-b last:border-b-0"
              onClick={() => {
                setUserInput("");
                setOpen(false);
              }}
            >
              <div className="font-medium text-sm text-neutral-900">
                {r.title}
              </div>
              <div className="text-xs text-neutral-600">
                {excerpt(r.content, 18)}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {r.users?.username ?? "Unknown"}
              </div>
            </Link>
          ))}
        </div>
      )}

      {results && results.length === 0 && debounced && (
        <div className="bg-white border rounded-md p-3 text-sm text-neutral-500">
          Inga träffar
        </div>
      )}
    </div>
  );

  const popupContent = (
    <div className="z-[99999]">
      <div className="bg-white border rounded-xl shadow-lg p-3 search-popup-shadow">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            className="border-0 outline-none p-2 rounded-l-xl flex-1 text-sm"
            name="search"
            placeholder="Sök i inlägg"
          />
          <button
            aria-label="Sök"
            onClick={async () => {
              try {
                await (refetch ? refetch() : Promise.resolve());
              } catch {}
            }}
            className="ml-2 inline-flex items-center justify-center px-3 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
          >
            <Search size={16} />
          </button>
        </div>
        {dropdown}
      </div>
    </div>
  );
  const mobileInline = (
    <div className="block md:hidden w-[90%] mx-auto mt-8">
      <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
        <Search size={18} className="text-neutral-500" />
        <input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border-0 outline-none p-0 w-full text-sm"
          name="search"
          placeholder="Search posts"
        />
        <button
          aria-label="Sök"
          onClick={async () => {
            try {
              await (refetch ? refetch() : Promise.resolve());
            } catch {}
          }}
          className="ml-2 inline-flex items-center justify-center px-3 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
        >
          <Search size={16} />
        </button>
      </div>
      <div className="mt-2">{dropdown}</div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {!isMobile && (
        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
          <Search size={18} className="text-neutral-500" />
          <input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="border-0 outline-none p-0 w-full text-sm"
            name="search"
            placeholder="Search posts"
          />
          <button
            aria-label="Sök"
            onClick={async () => {
              try {
                await (refetch ? refetch() : Promise.resolve());
              } catch {}
            }}
            className="ml-2 inline-flex items-center justify-center px-3 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
          >
            <Search size={16} />
          </button>
        </div>
      )}
      {!isMobile && (
        <div className="absolute left-0 z-50 mt-2 w-full max-w-[90vw] sm:max-w-md">
          {dropdown}
        </div>
      )}
      {isMobile && isHome && mobilePortalReady && mobileRootRef.current
        ? createPortal(mobileInline, mobileRootRef.current)
        : null}
    </div>
  );
}
export function MobileSearchInline(): React.ReactElement {
  const [userInput, setUserInput] = useState("");
  const debounced = useDebouncedValue(userInput, 250);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["search-results-mobile", debounced],
    queryFn: async () => {
      const term = String(debounced ?? "").trim();
      const { data, error } = await getSearchPosts(term);
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(debounced && String(debounced).trim().length >= 2),
  });

  const results = data ?? [];

  const excerpt = (s: string | null | undefined, n = 18) => {
    if (!s) return "";
    const words = String(s).split(/\s+/).filter(Boolean);
    return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "...";
  };

  return (
    <div className="block md:hidden w-[90%] mx-auto mt-8">
      <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
        <Search size={18} className="text-neutral-500" />
        <input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border-0 outline-none p-0 w-full text-sm"
          name="search"
          placeholder="Sök i inlägg"
        />
        <button
          aria-label="Sök"
          onClick={async () => {
            try {
              await (refetch ? refetch() : Promise.resolve());
            } catch {}
          }}
          className="ml-2 inline-flex items-center justify-center px-3 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
        >
          <Search size={16} />
        </button>
      </div>
      <div className="mt-2 w-full">
        {debounced && debounced.trim().length < 2 ? (
          <div className="bg-white border rounded-md p-3 text-sm text-neutral-500">Skriv minst 2 tecken för att söka</div>
        ) : null}

        {results && results.length > 0 && (
          <div className="bg-white border rounded-md overflow-hidden">
            {results.map((r: any) => (
              <Link
                href={`/${r.slug}`}
                key={r.slug}
                className="block p-3 hover:bg-slate-50 border-b last:border-b-0"
                onClick={() => {
                  setUserInput("");
                }}
              >
                <div className="font-medium text-sm text-neutral-900">{r.title}</div>
                <div className="text-xs text-neutral-600">{excerpt(r.content, 18)}</div>
                <div className="text-xs text-neutral-500 mt-1">{r.users?.username ?? "Unknown"}</div>
              </Link>
            ))}
          </div>
        )}

        {results && results.length === 0 && debounced && (
          <div className="bg-white border rounded-md p-3 text-sm text-neutral-500">Inga träffar</div>
        )}
      </div>
    </div>
  );
}
