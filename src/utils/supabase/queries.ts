import { type QueryData } from "@supabase/supabase-js";
import { createClient } from "./browser.client";

export const getHomePosts = async (supabase?: any, category?: string | null) => {
  const client = supabase ?? createClient();
  try {
    let query = client
      .from("posts")
      .select(
        "id, title, slug, user_id, image_url, category, users:users!posts_user_id_fkey(id, username)"
      )
      .order("created_at", { ascending: false });

    if (category && category !== "") {
      query = query.eq('category', category);
    }

    return await query;
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    if (err?.code === "42703" || /column .* does not exist/i.test(msg)) {
      return await client
        .from("posts")
        .select("id, title, slug, user_id, users:users!posts_user_id_fkey(id, username)")
        .order("created_at", { ascending: false });
    }
    throw err;
  }
};

export const getSinglePost = async (slug: string, supabase?: any) => {
  const client = supabase ?? createClient();
  try {
    const res = await client
      .from("posts")
      .select(
        "id, title, slug, content, user_id, image_url, category, users:users!posts_user_id_fkey(id, username)"
      )
      .eq("slug", slug);

    if (res.data && Array.isArray(res.data)) {
      return { data: res.data[0] ?? null, error: res.error, status: res.status };
    }
    return res;
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    if (err?.code === "42703" || /column .* does not exist/i.test(msg)) {
      const res = await client
        .from("posts")
        .select(
          "id, title, slug, content, user_id, users:users!posts_user_id_fkey(id, username)"
        )
        .eq("slug", slug);

      if (res.data && Array.isArray(res.data)) {
        return { data: res.data[0] ?? null, error: res.error, status: res.status };
      }
      return res;
    }
    throw err;
  }
};

export const getSearchPosts = async (
  searchTerm: string,
  supabase = createClient()
) => {
  return await supabase
    .from("posts")
    .select("title, slug")
    .ilike("title", `${searchTerm}%`);
};

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchPostType = QueryData<ReturnType<typeof getSearchPosts>>;
