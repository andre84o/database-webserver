import HomePosts from "@/app/components/Home/HomePosts";
import { getHomePosts, HomePostType } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";

export default async function Home() {
  const supabase = createClient();
   const { data,error } = await getHomePosts(supabase);

  return (
      <div className="w-[80%] mx-auto mt-4">
        <HomePosts posts={data!} />
      </div>
    
  );
}
