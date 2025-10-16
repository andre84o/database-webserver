import { type QueryData } from "@supabase/supabase-js";
import { createClient } from "./browser.client";

// Use an injected client when provided, otherwise create a browser client.
export const getHomePosts = async (supabase = createClient()) => {
  return await supabase
    .from("posts")
    .select("id, title, slug, users:users(username)")
    .order("created_at", { ascending: false });
};

export const getSinglePost = async (slug: string, supabase = createClient()) => {
  return await supabase
    .from("posts")
    .select("id, title, slug, content, user_id, users:users(username)")
    .eq("slug", slug)
    .single();
};

export const getSearchPosts = async (searchTerm: string, supabase = createClient()) => {
  return await supabase
    .from("posts")
    .select("title, slug")
    .ilike("title", `${searchTerm}%`);
};

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchPostType = QueryData<ReturnType<typeof getSearchPosts>>;
