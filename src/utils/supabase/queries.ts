import { type QueryData } from "@supabase/supabase-js";

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
