export const dynamic = 'force-dynamic'
import { getSinglePost } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import DeletePost from "@/actions/delete.post";

const SinglePost = async (props: any) => {
  const { slug } = props.params as { slug: string };
  const { data, error } = await getSinglePost(slug);

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
          <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
            <h2 className="font-bold text-xl">{data.title}</h2>
            <p className="mt-4">Author {data.users?.username}</p>
            {data.image_url && (
              <div className="mt-4">
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="max-h-80 w-full object-cover rounded"
                />
              </div>
            )}
            {isOwner && (
              <div className="mt-4 flex gap-2">
                <Link href={`/${data.slug}/edit`} className="button-quaternary">
                  Edit
                </Link>
                <form action={"/api/posts/delete"} method="post">
                  <input type="hidden" name="postId" value={String(data.id)} />
                  <button type="submit" className="button-danger">
                    Delete
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
            {data.content && <div>{data.content}</div>}
          </div>
        </>
      )}
    </>
  );
};

export default SinglePost;
