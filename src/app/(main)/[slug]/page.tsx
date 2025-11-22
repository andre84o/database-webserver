export const dynamic = 'force-dynamic'
import { getSinglePost } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import CommentsHost from "./Comments/CommentsHost";

const SinglePost = async (props: any) => {
  const awaitedProps = await props;
  const paramsPromise = (awaitedProps as any).params;
  const params = await paramsPromise;
  const { slug } = params as { slug: string };
  const res = await getSinglePost(slug);
  const data = (res as any).data ?? res;
  const error = (res as any).error ?? null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const isOwner = data?.user_id === userId;

  return (
    <>
      {error && (
        <div className="text-red-500">{String(error?.message ?? error)}</div>
      )}
      {data && (
        <>
          <div className="max-w-2xl mx-auto px-4 py-4 border-gray-700 border-1 mt-12 rounded-2xl">
            {data.image_url ? (
              <div className="overflow-hidden rounded-2xl mb-4">
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="w-full h-72 object-cover"
                />
              </div>
            ) : null}

            <div className="mb-3 flex items-center justify-between">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                {data.category ?? "Featured"}
              </span>
              <div className="text-sm text-gray-600">
                {data.users?.username ?? "Unknown"}
              </div>
            </div>
            <h1 className="font-extrabold text-2xl md:text-3xl mb-2">
              {data.title}
            </h1>
            {data.content && (
              <p className="text-lg text-neutral-700 mt-4 mb-2 max-w-prose leading-relaxed">
                {String(data.content).split("\n")[0]}
              </p>
            )}
            {isOwner && (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/${data.slug}/edit`}
                  className="button-quaternary cursor-pointer hover:border-green-500"
                >
                  Edit
                </Link>
                <DeleteButton postId={String(data.id)} />
              </div>
            )}
          </div>
          <div className="max-w-2xl mx-auto px-4 py-6 mt-6 rounded-2xl bg-white shadow-sm">
            {data.content && (
              <div className="prose max-w-none">{data.content}</div>
            )}
          </div>
          <div>
            <CommentsHost postId={data.id} postOwnerId={data.user_id} />
          </div>
        </>
      )}
    </>
  );
};

export default SinglePost;
