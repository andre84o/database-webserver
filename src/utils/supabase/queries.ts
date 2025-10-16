// Fil: utils/supabase/queries.ts
import { type QueryData } from "@supabase/supabase-js";
import { createClient } from "./browser.client";

export const getHomePosts = async (supabase?: any) => {
  const client = supabase ?? createClient();
  // Svenska: Ta med user_id samt users.id så vi kan jämföra mot currentUserId
  return await client
    .from("posts")
    .select(
      "id, title, slug, user_id, users:users!posts_user_id_fkey(id, username)"
    )
    .order("created_at", { ascending: false });
};

export const getSinglePost = async (slug: string, supabase?: any) => {
  const client = supabase ?? createClient();
  // Svenska: Samma form även här så komponenterna får konsekventa fält
  return await client
    .from("posts")
    .select(
      "id, title, slug, content, user_id, users:users!posts_user_id_fkey(id, username)"
    )
    .eq("slug", slug)
    .single();
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
