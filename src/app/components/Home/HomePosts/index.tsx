"use client";
import { getHomePosts } from "@/utils/supabase/queries";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/browser.client";
import { useEffect, useState } from "react";

type PostItem = {
  id: number;
  slug: string;
  title: string;
  category?: string | null;
  image_url?: string | null;
  user_id?: string | null;
  users?: { id?: string; username?: string } | null;
};

const HomePosts = ({ posts }: { posts: PostItem[] }) => {
  const supabase = createClient();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, [supabase]);

  const { data } = useQuery<PostItem[]>({
    queryKey: ["home-posts", category],
    queryFn: async () => {
      const { data, error } = await getHomePosts(supabase, category ?? null);
      if (error) throw error;
      return data;
    },
    initialData: posts,
    refetchOnMount: false,
    staleTime: 10000,
  });

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option>Food</option>
            <option>Politics</option>
            <option>Travel</option>
            <option>Inspiration</option>
            <option>News</option>
            <option>Food &amp; Recipes</option>
            <option>Photo &amp; Design</option>
            <option>Productivity</option>
          </select>
        </label>
      </div>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {data && data.length > 0 ? (
          <>
            {data[0] && (
              <Link href={`/${data[0].slug}`} key={data[0].id} className="lg:col-span-2 lg:row-span-2 block h-full">
                <article className="group relative overflow-hidden rounded-3xl shadow-xl bg-white/3 hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                  {/* Image on top */}
                  <div className="w-full overflow-hidden">
                    {data[0].image_url ? (
                      <img src={data[0].image_url} alt={data[0].title} className="w-full h-56 md:h-72 object-cover" />
                    ) : (
                      <div className="w-full h-56 md:h-72 bg-gray-200" />
                    )}
                  </div>

                  {/* Content below */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-amber-300 text-black text-xs px-3 py-1 rounded-full mb-3">{data[0].category ?? 'Featured'}</span>
                      <h2 className="font-extrabold text-3xl md:text-4xl text-neutral-900 mb-2">{data[0].title}</h2>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 text-sm text-neutral-600">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        {data[0].users?.username ? data[0].users.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>{data[0].users?.username ?? "Unknown"}</div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {data.slice(1).map(({ id, slug, title, image_url, users }) => (
              <Link
                key={id}
                href={`/${slug}`}
                className="block rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                <article className="relative overflow-hidden rounded-2xl shadow-md bg-white/50 hover:shadow-lg transition-shadow duration-200">
                  {image_url ? (
                    <img src={image_url} alt={title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gray-200" />
                  )}

                  <div className="p-4">
                    <span className="inline-block text-xs text-neutral-900 bg-amber-300 px-2 py-1 rounded-full mb-2">
                      {(data as any).find((p: any) => p.id === id)?.category ?? 'Featured'}
                    </span>
                    <h3 className="font-semibold text-lg mb-2 text-neutral-900">{title}</h3>
                    <div className="flex items-center justify-between text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                          {users?.username ? users.username.charAt(0).toUpperCase() : "U"}
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
