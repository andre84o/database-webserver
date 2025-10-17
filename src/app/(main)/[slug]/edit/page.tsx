export const dynamic = "force-dynamic";
import { getSinglePost } from "@/utils/supabase/queries";
import EditForm from "./EditForm";



const EditPage = async (props: any) => {
  const awaitedProps = await props;
  const paramsPromise = (awaitedProps as any).params;
  const params = await paramsPromise;
  const { slug } = params as { slug: string };
  const { data, error } = await getSinglePost(slug);

  if (!data) {
    return (
      <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
      <h1 className="font-bold text-xl mb-4">Edit Post</h1>
        <EditForm
          postId={data.id}
          initialTitle={data.title}
          initialContent={data.content}
          initialImageUrl={data.image_url}
          initialCategory={data.category ?? null}
        />
    </div>
  );
};

export default EditPage;
