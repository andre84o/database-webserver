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
      <div className="grid grid-cols-4 gap-4">
        {data?.map(({ id, slug, title, image_url, user_id, users }) => {
          const ownerIdFromJoin = users?.id ?? null;
          const isOwner =
            (currentUserId && user_id && currentUserId === user_id) ||
            (currentUserId &&
              ownerIdFromJoin &&
              currentUserId === ownerIdFromJoin);

          return (
            <Link
              key={id}
              href={`/${slug}`}
              className="block mt-4 p-4 border rounded-xl"
            >
              {image_url ? (
                <div className="mb-2">
                  <img
                    src={image_url}
                    alt={title}
                    className="w-[250px] h-[200px] object-cover rounded-none"
                  />
                </div>
              ) : null}

              <h2 className="font-bold text-xl">{title}</h2>

              <div className="text-right">
                by{" "}
                <span
                  className={
                    isOwner
                      ? "bg-slate-200/60 border border-slate-300 text-slate-700 px-2 py-[2px] rounded-md text-xs"
                      : ""
                  }
                >
                  {users?.username ?? "Unknown"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default HomePosts;
