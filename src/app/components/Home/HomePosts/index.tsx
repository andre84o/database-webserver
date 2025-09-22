'use client'
import { getHomePosts, HomePostType } from "@/utils/supabase/queries";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const HomePosts = ({ posts }: { posts: HomePostType }) => {
 const {data} = useQuery ({
    queryKey: ['home-posts'],
    queryFn: async () => {
      const {data, error} = await getHomePosts()
      if(error) throw error;
      return data;
    },
    initialData: posts,
    refetchOnMount: false,
 })
    return (
      <div>
        {data && data.map(({id, slug, title, users }) => 
            <Link href={`/${slug}`} className="block border-1 rounded-xl mt-4 p-4 w-200 h-auto" key={id}>
              <h2 className="font-bold text-xl">{title}</h2>
              <div className="text-right">by {users?.username}</div>
            </Link>)}
      </div>
      
    )
   }
export default HomePosts;