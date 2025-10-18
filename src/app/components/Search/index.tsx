"use client"
import { useState, useEffect, useRef, useLayoutEffect, SetStateAction } from "react";
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

const SearchInput = () => {
  const [userInput, setUserInput] = useState<string>("");
  const debounced = useDebouncedValue(userInput, 250);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalStyle, setPortalStyle] = useState<{ left: number; top: number; width: number } | null>(null);

  const { data } = useQuery({
    queryKey: ["search-results", debounced],
    queryFn: async () => {
      const term = String(debounced ?? "").trim();
      const { data, error } = await getSearchPosts(term);
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(debounced && String(debounced).trim().length >= 2),
  });

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setUserInput(e.target.value as string);
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (portalRef.current && portalRef.current.contains(target)) return;
      setUserInput("");
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  const results = data ?? [];

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-search-portal', '1');
    document.body.appendChild(el);
    portalRef.current = el;
    return () => {
      if (portalRef.current && portalRef.current.parentElement) {
        portalRef.current.parentElement.removeChild(portalRef.current);
      }
      portalRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      setPortalStyle(null);
      return;
    }
    const inputEl = inputRef.current ?? containerRef.current?.querySelector('input');
    if (!inputEl) {
      setPortalStyle(null);
      return;
    }
    const rect = (inputEl as HTMLElement).getBoundingClientRect();
    const left = Math.max(8, rect.left + window.scrollX);
    const top = rect.bottom + window.scrollY + 8;
    const width = Math.min(rect.width, window.innerWidth - 32);
    setPortalStyle({ left, top, width });

    if (portalRef.current) {
      portalRef.current.style.position = 'absolute';
      portalRef.current.style.left = `${left}px`;
      portalRef.current.style.top = `${top}px`;
      portalRef.current.style.width = `${width}px`;
      portalRef.current.style.zIndex = '99999';
    }
  }, [debounced, results.length]);

  const excerpt = (s: string | null | undefined, n = 18) => {
    if (!s) return "";
    const words = String(s).split(/\s+/).filter(Boolean);
    return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "...";
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
              onClick={() => setUserInput("")}
            >
              <div className="font-medium text-sm text-neutral-900">{r.title}</div>
              <div className="text-xs text-neutral-600">{excerpt(r.content, 18)}</div>
              <div className="text-xs text-neutral-500 mt-1">{r.users?.username ?? "Unknown"}</div>
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
  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <Search size={18} />
        <input
          ref={inputRef}
          value={userInput}
          onChange={handleChange}
          className="border rounded-xl p-2 w-full sm:w-64"
          name="search"
          placeholder="Search posts"
        />
      </div>
      {portalRef.current && portalStyle ? (
        createPortal(
          <div className="z-[99999]" aria-live="polite">
            {dropdown}
          </div>,
          portalRef.current
        )
      ) : (
        <div className="absolute left-0 z-50 mt-2 w-full max-w-[90vw] sm:max-w-md">
          {dropdown}
        </div>
      )}
    </div>
  );
};

export default SearchInput;