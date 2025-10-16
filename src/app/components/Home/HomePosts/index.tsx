"use client"
import { getHomePosts } from "@/utils/supabase/queries";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/browser.client";

type PostItem = {
  id: number
  slug: string
  title: string
  users?: { username?: string } | null
}

const HomePosts = ({ posts }: { posts: PostItem[] }) => {
 const {data} = useQuery<PostItem[]>({
    queryKey: ['home-posts'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await getHomePosts(supabase);

      if (error) throw error;
      return data;
    },
    initialData: posts,
    refetchOnMount: false,
    staleTime:10000
 })
    return (
      <div>
        {data && data.map(({id, slug, title, users }) => 
            <Link href={`/${slug}`} className="block border-1 rounded-xl mt-4 p-4" key={id}>
              <h2 className="font-bold text-xl">{title}</h2>
              <div className="text-right">by {users?.username}</div>
            </Link>)}
      </div>
      
    )
   }


export default HomePosts;