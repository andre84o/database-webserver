"use server";
import { getSinglePost } from "@/utils/supabase/queries";
import EditForm from "./EditForm";

export async function handleEdit(formData: FormData) {
  const { EditPost } = await import("@/actions/edit-post");
  await EditPost(formData);
}

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
      <EditForm
        postId={data.id}
        initialTitle={data.title}
        initialContent={data.content}
        initialImageUrl={data.image_url}
        action={handleEdit}
      />
    </div>
  );
};

export default EditPage;
