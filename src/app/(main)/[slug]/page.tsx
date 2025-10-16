import { getSinglePost } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import DeletePost from "@/actions/delete.post";

export async function handleDelete(formData: FormData) {
  const postId = formData.get("postId")?.toString() ?? "";
  await DeletePost(postId);
}

const SinglePost = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const { data, error } = await getSinglePost(slug);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const isOwner = data?.user_id === userId;

  return (
    <>
      {data && (
        <>
          <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
            <h2 className="font-bold text-xl">{data.title}</h2>
            <p className="mt-4">Author {data.users?.username}</p>
            {isOwner && (
              <div className="mt-4 flex gap-2">
                <Link href={`/${data.slug}/edit`} className="button">
                  Edit
                </Link>
                <form action={handleDelete} method="post">
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
