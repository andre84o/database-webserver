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
  image_url?: string | null;
  user_id?: string | null;
  users?: { id?: string; username?: string } | null;
};

const HomePosts = ({ posts }: { posts: PostItem[] }) => {
  const supabase = createClient();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, [supabase]);

  const { data } = useQuery<PostItem[]>({
    queryKey: ["home-posts"],
    queryFn: async () => {
      const { data, error } = await getHomePosts(supabase);
      if (error) throw error;
      return data;
    },
    initialData: posts,
    refetchOnMount: false,
    staleTime: 10000,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data && data.length > 0 ? (
          <>
            {data[0] && (
              <Link
                href={`/${data[0].slug}`}
                key={data[0].id}
                className="lg:col-span-2 lg:row-span-2 block"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                  <div className="flex-1 overflow-hidden rounded-2xl">
                    {data[0].image_url ? (
                      <img
                        src={data[0].image_url}
                        alt={data[0].title}
                        className="w-full h-64 lg:h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-64 lg:h-full bg-gray-200 rounded-2xl" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center p-4">
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full mb-2">
                      Featured
                    </span>
                    <h2 className="font-extrabold text-2xl md:text-3xl mb-2">
                      {data[0].title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {data[0].users?.username ?? "Unknown"}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {data.slice(1).map(({ id, slug, title, image_url, users }) => (
              <Link
                key={id}
                href={`/${slug}`}
                className="block rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                <div className="relative">
                  {image_url ? (
                    <img
                      src={image_url}
                      alt={title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200" />
                  )}
                </div>

                <div className="p-4">
                  <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2">
                    Category
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        {users?.username ? users.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>{users?.username ?? "Unknown"}</div>
                    </div>
                    <div className="text-xs">5min read</div>
                  </div>
                </div>
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
