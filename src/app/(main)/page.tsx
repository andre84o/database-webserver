export const dynamic = "force-dynamic";
import HomePosts from "@/app/components/Home/HomePosts";
import Link from "next/link";
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import ExplorePostsLink from "@/app/components/Home/HomePosts/ExplorePostsLink";
import { MobileSearchInline } from "@/app/components/Search";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);

  return (
    <div className="w-[100%] mx-auto mt-8">
      <MobileSearchInline />
      <section className="relative h-[50vh] md:h-[70vh] w-full rounded-3xl overflow-hidden mb-12 mt-5 bg-gradient-to-r from-gray-900/50 via-neutral-700/100/30 to-purple-400/50 text-white shadow-2xl">
        <div className="h-full flex items-center">
          <div className="p-8 md:p-16 lg:p-24 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] sm:leading-tight mb-6 tracking-tight">
              Tastefully Curated Stories
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-6">
              A premium collection of visual essays and recipes — elegantly
              designed, meticulously edited.
            </p>
            <div className="flex gap-2 sm:gap-3 mt-10">
              <div className="transform-gpu scale-95 sm:scale-100">
                <ExplorePostsLink />
              </div>
              <Link
                href="/about"
                className="inline-block bg-[#FFB9B3] hover:bg-[#BD807A] text-white text-2xl px-6 py-3 rounded-full font-semibold
                shadow-2xl shadow-white max-[396px]:px-3 max-[396px]:py-2 max-[396px]:rounded-full max-[396px]:text-xs active:shadow-red-500/50"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </section>
      {error && (
        <div className="text-red-500">{String(error?.message ?? error)}</div>
      )}
      {(!data || data.length === 0) && (
        <div className="text-center text-sm text-gray-500">No posts found</div>
      )}
      <HomePosts posts={data ?? []} />
    </div>
  );
}
