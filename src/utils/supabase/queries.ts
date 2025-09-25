import { type QueryData } from "@supabase/supabase-js";
import {createClient} from "./browser.client"

export const getHomePosts = async (SUPABASE: ReturnType<typeof createClient>) => {
  const supabase = createClient()
    return await supabase.from('posts')
        .select('id, title, slug, users("username")')
        .order('created_at', { ascending: false })
}


export const getSinglePost = async (slug:string) => {
    const supabase = createClient();

    return await supabase.from('posts')
                          .select('id, title, slug, content, users("username")')
                          .eq('slug', slug)
                          .single()
}

export const getSearchPosts = async (searchTerm: string) => {
    const supabase = createClient()
    return await supabase.from('posts')
                          .select('title, slug')
                          .ilike('title', `${searchTerm}%'`)

}
export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
