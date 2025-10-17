export const dynamic = "force-dynamic";
import { getSinglePost } from "@/utils/supabase/queries";
import EditForm from "./EditForm";
import { EditPost } from "@/actions/edit.post";



const EditPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
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
      <form action={EditPost} encType="multipart/form-data">
        <EditForm
          postId={data.id}
          initialTitle={data.title}
          initialContent={data.content}
          initialImageUrl={data.image_url}
        />
      </form>
    </div>
  );
};

export default EditPage;
