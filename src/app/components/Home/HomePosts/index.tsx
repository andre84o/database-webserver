"use client";
import { getHomePosts } from "@/utils/supabase/queries";
import Link from "next/link";
import SearchInput from "@/app/components/Search";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/browser.client";
import { useEffect, useState } from "react";
import { CATEGORY_OPTIONS } from "@/actions/category-options";

type PostItem = {
  id: number;
  slug: string;
  title: string;
  content?: string | null;
  category?: string | null;
  image_url?: string | null;
  user_id?: string | null;
  users?: { id?: string; username?: string } | null;
};

const HomePosts = ({ posts }: { posts: PostItem[] }) => {
  const supabase = createClient();

  const excerptWords = (s: string | undefined | null, n = 9) => {
    const parts = String(s ?? "").split(/\s+/).filter(Boolean);
    return parts.length <= n ? parts.join(" ") : parts.slice(0, n).join(" ") + "...";
  };

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const SHOW_CATEGORY = false;
  const [category, setCategory] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, [supabase]);

  const { data } = useQuery<PostItem[]>({
    queryKey: ["home-posts", category],
    queryFn: async () => {
      console.debug("getHomePosts queryFn running with category:", category);
      const { data, error } = await getHomePosts(supabase, category ?? null);
      if (error) throw error;
      return data;
    },
    initialData: posts,
    refetchOnMount: false,
    staleTime: 10000,
  });

  const sortedData = data ? (() => {
    const postsWithImages = data.filter(p => p.image_url && p.image_url.trim() !== '');
    const postsWithoutImages = data.filter(p => !p.image_url || p.image_url.trim() === '');
    
    if (postsWithImages.length > 0) {
      const featured = postsWithImages.find(p => p.id !== data[0]?.id) || postsWithImages[0];
      const remaining = postsWithImages.filter(p => p.id !== featured.id);
      
      return [featured, ...postsWithoutImages, ...remaining];
    }
    
    return data;
  })() : data;

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="order-2 md:order-1 w-full md:w-auto md:mr-6">
          <SearchInput />
        </div>
        {SHOW_CATEGORY && (
          <div className="order-1 md:order-2">
            <label className="flex items-center gap-2">
              <span className="text-sm">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <div
        className="
    grid grid-cols-1
    sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    gap-6
    auto-rows-[20rem]
  "
      >
        {sortedData && sortedData.length > 0 ? (
          <>
            {sortedData[0] && (
              <Link
                href={`/${sortedData[0].slug}`}
                key={sortedData[0].id}
                className="lg:col-span-2 lg:row-span-2 block h-full"
              >
                <article className="relative overflow-hidden rounded-3xl shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                  {sortedData[0].image_url && sortedData[0].image_url.trim() ? (
                    <div className="w-full overflow-hidden">
                      <img
                        src={sortedData[0].image_url}
                        alt={sortedData[0].title}
                        className="w-full h-40 sm:h-56 md:h-72 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 sm:h-56 md:h-72 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-8">
                      <h2 className="font-extrabold text-3xl md:text-4xl text-neutral-900 text-center">
                        {sortedData[0].title}
                      </h2>
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-[var(--brand-center)] text-white text-xs px-3 py-1 rounded-full mb-3">
                        {sortedData[0].category ?? "Featured"}
                      </span>
                      <h2 className="font-extrabold text-3xl md:text-4xl text-neutral-900 mb-2"></h2>
                      {sortedData[0].content && (
                        <p className="text-lg text-neutral-700 mt-2 line-clamp-2">
                          {String(sortedData[0].content).slice(0, 160)}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-sm text-neutral-600">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        {sortedData[0].users?.username
                          ? sortedData[0].users.username.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>{sortedData[0].users?.username ?? "Unknown"}</div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {sortedData.slice(1).map(({ id, slug, title, image_url, users, content }) => (
              <Link
                key={id}
                href={`/${slug}`}
                className="block rounded-2xl overflow-hidden shadow-xl h-80"
              >
                <article className="relative overflow-hidden rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-200 h-80 flex flex-col">
                  {image_url && image_url.trim() ? (
                    <img
                      src={image_url}
                      alt={title}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
                      <h3 className="font-bold text-lg text-neutral-900 text-center line-clamp-2">
                        {title}
                      </h3>
                    </div>
                  )}

                  <div className={`p-3 sm:p-4 flex flex-col flex-1 ${!image_url ? 'justify-center' : ''}`}>
                    <span className="inline-flex w-fit flex-none whitespace-nowrap text-xs text-white bg-[var(--brand-center)] px-2 py-1 rounded-full mb-2">
                      {(sortedData as any).find((p: any) => p.id === id)?.category ??
                        "Featured"}
                    </span>
                    <h3 className={`font-semibold mb-2 text-neutral-900 ${!image_url ? 'text-2xl' : 'text-lg'}`}>
                      {title}
                    </h3>
                    {!image_url && content && (
                      <p className="text-base text-neutral-600 mb-3 line-clamp-3">
                        {excerptWords(content, 20)}
                      </p>
                    )}
                    {image_url && (
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-1">
                        {excerptWords(content, 9)}
                      </p>
                    )}
                    <div className="mt-2 lg:-mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                          {users?.username
                            ? users.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>{users?.username ?? "Unknown"}</div>
                      </div>
                      <div className="text-xs">5min read</div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <div>No posts yet</div>
        )}
      </div>
    </>
  );
};

export default HomePosts;
