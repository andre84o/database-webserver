export const dynamic = "force-dynamic";
import { getSinglePost } from "@/utils/supabase/queries";
import EditForm from "./EditForm";



const EditPage = async (props: any) => {
  const awaitedProps = await props;
  const paramsPromise = (awaitedProps as any).params;
  const params = await paramsPromise;
  const { slug } = params as { slug: string };
  const res = await getSinglePost(slug);
  const data = (res as any).data ?? res;
  const error = (res as any).error ?? null;

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">Post not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 mt-4 mb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h1 className="font-bold text-xl mb-4">Edit Post</h1>
        <EditForm
          postId={data.id}
          initialTitle={data.title}
          initialContent={data.content}
          initialImageUrl={data.image_url}
          initialCategory={data.category ?? null}
        />
      </div>
    </div>
  );
};

export default EditPage;
