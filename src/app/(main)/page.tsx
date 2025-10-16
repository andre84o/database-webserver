import HomePosts from "@/app/components/Home/HomePosts";
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);
  return (
    <div className="w-[80%] mx-auto mt-4">
      {(!data || data.length === 0) && (
        <div className="text-center text-sm text-gray-500">Inga inlägg hittades</div>
      )}
      <HomePosts posts={data ?? []} />
    </div>
  );
}
