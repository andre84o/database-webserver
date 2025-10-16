import HomePosts from "@/app/components/Home/HomePosts";
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);

  return (
    <div className="w-[80%] mx-auto mt-4">
      <HomePosts posts={data!} />
    </div>
  );
}
