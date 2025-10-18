import type { QueryData, SupabaseClient, PostgrestResponse } from "@supabase/supabase-js";
import { createClient } from "./browser.client";
import type { Database } from "./database.types";

export const getHomePosts = async (
  supabase?: SupabaseClient<Database> | null,
  category?: string | null
) => {
  const client: SupabaseClient<Database> = (supabase as SupabaseClient<Database>) ?? createClient();
  try {
    let query = client
      .from("posts")
      .select(
        "id, title, slug, content, user_id, image_url, category, users:users!posts_user_id_fkey(id, username)"
      )
      .order("created_at", { ascending: false });

    if (category && category !== "") {
      const cat = String(category).trim();
      if (cat !== "") {
        query = query.ilike('category', cat);
      }
    }

    const res = await query;
    return { data: res.data ?? null, error: res.error, status: res.status } as PostgrestResponse<any>;
  } catch (err: unknown) {
    const msg = String((err as any)?.message ?? err);
    if ((err as any)?.code === "42703" || /column .* does not exist/i.test(msg)) {
      const res = await client
        .from("posts")
        .select("id, title, slug, content, user_id, users:users!posts_user_id_fkey(id, username)")
        .order("created_at", { ascending: false });
      return { data: res.data ?? null, error: res.error, status: res.status } as PostgrestResponse<any>;
    }
    throw err;
  }
};

export const getSinglePost = async (
  slug: string,
  supabase?: SupabaseClient<Database> | null
) => {
  const client: SupabaseClient<Database> = (supabase as SupabaseClient<Database>) ?? createClient();
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
  } catch (err: unknown) {
    const msg = String((err as any)?.message ?? err);
    if ((err as any)?.code === "42703" || /column .* does not exist/i.test(msg)) {
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
  supabase: SupabaseClient<Database> = createClient()
) => {
  const q = supabase.from("posts").select(
    "id, title, slug, content, user_id, users:users!posts_user_id_fkey(id, username)"
  );

  return await q.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
};

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchPostType = QueryData<ReturnType<typeof getSearchPosts>>;
