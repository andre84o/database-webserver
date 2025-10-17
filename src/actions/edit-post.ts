"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server-client";
import { uploadImages } from "@/utils/supabase/upload-images";

export async function EditPost(formData: FormData) {
  const postIdRaw = formData.get("postId");
  const postId =
    typeof postIdRaw === "string"
      ? Number(postIdRaw)
      : postIdRaw instanceof File
      ? Number.NaN
      : Number(postIdRaw ?? Number.NaN);

  if (!Number.isFinite(postId)) {
    throw new Error("Invalid postId");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const userId = user?.id ?? null;

  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("user_id, image_url")
    .eq("id", postId)
    .maybeSingle();

  if (postErr) throw postErr;
  if (!post) throw new Error("Post not found");
  if (post.user_id !== userId) {
    throw new Error("Not authorized to edit this post");
  }

  const updates: {
    title?: string;
    content?: string | null;
    image_url?: string | null;
  } = {};

  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title === "string") updates.title = title;
  if (typeof content === "string") {
    const trimmed = content.trim();
    updates.content = trimmed.length === 0 ? null : content;
  }

  const image = formData.get("image");
  const removeImage = formData.get("removeImage");

  if (image instanceof File && image.size > 0) {
    const image_url = await uploadImages(image);
    updates.image_url = image_url;
  } else if (removeImage) {
    updates.image_url = null;
  }

  const { error: updErr } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId);
  if (updErr) throw updErr;

  redirect("/");
}

export default EditPost;
