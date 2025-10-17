'use client'
import { useState, useEffect, useRef, SetStateAction } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSearchPosts } from "@/utils/supabase/queries";
import Link from "next/link";

// small debounce hook
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
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setUserInput("");
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const results = data ?? [];

  const excerpt = (s: string | null | undefined, n = 18) => {
    if (!s) return "";
    const words = String(s).split(/\s+/).filter(Boolean);
    return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "...";
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <Search size={18} />
        <input
          value={userInput}
          onChange={handleChange}
          className="border rounded-xl p-2 w-full sm:w-64"
          name="search"
          placeholder="Search posts"
        />
      </div>

  <div className="absolute left-0 z-50 mt-2 w-full max-w-[90vw] sm:max-w-md">
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
    </div>
  );
};

export default SearchInput;