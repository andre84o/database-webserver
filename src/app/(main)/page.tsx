export const dynamic = 'force-dynamic'
import HomePosts from "@/app/components/Home/HomePosts";
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);
  return (
    <div className="w-[90%] mx-auto mt-8">
      <section className="relative h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-gray-900 via-neutral-900 to-gray-800 text-white shadow-2xl">
        <div className="h-full flex items-center">
          <div className="p-8 md:p-16 lg:p-24 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">Tastefully Curated Stories</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6">A premium collection of visual essays and recipes — elegantly designed, meticulously edited.</p>
            <div className="flex gap-3">
              <a href="#posts" className="inline-block bg-amber-500 text-black px-6 py-3 rounded-full font-semibold shadow">Explore Posts</a>
              <a href="#" className="inline-block border border-white/20 text-white px-5 py-3 rounded-full">About</a>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="text-red-500">{String(error?.message ?? error)}</div>}
      {(!data || data.length === 0) && (
        <div className="text-center text-sm text-gray-500">Inga inlägg hittades</div>
      )}

      <HomePosts posts={data ?? []} />
    </div>
  );
}
