import HomePosts from "@/app/components/Home/HomePosts";
import { getHomePosts, HomePostType } from "@/utils/supabase/queries";

export default async function Home() {
   const { data,error } = await getHomePosts();

  return (
      <div className="w-[80%] mx-auto mt-4">
        <HomePosts posts={data!} />
      </div>
    
  );
}
