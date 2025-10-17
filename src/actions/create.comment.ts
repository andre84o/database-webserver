"use server";

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export const CreateComment = async (formData: FormData) => {
  const content = String(formData.get("content") ?? "");
  const postId = Number(formData.get("postId"));
  if (!content || !postId) throw new Error("Missing content or postId");

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const { data: inserted, error: insertErr } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, content })
    .select("id, post_id, author_id, content, created_at, updated_at");

  if (insertErr) throw insertErr;

  try {
    revalidatePath(`/`);
  } catch (e) {}

  return inserted;
};

export default CreateComment;
