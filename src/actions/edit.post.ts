"use server"

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import { uploadImages } from "@/utils/supabase/upload-images"

export const EditPost = async (formData: FormData) => {
  try {
    const postIdRaw = formData.get('postId')
    const postId = typeof postIdRaw === 'string' ? Number(postIdRaw) : Number(postIdRaw ?? NaN)

    const supabase = await createClient()


  // verify owner (don't select image_url because the column may not exist)
  const { data: post, error: postErr } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle();

  // Debug: log the select result to diagnose RLS/permission issues
  try {
    // eslint-disable-next-line no-console
    console.log('EditPost fetched post:', { post, postErr });
  } catch {}
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const userId = user?.id ?? null

  // Debug: log owner check values
  try {
    // eslint-disable-next-line no-console
    console.log("EditPost owner check", { postId, postUserId: (post as any)?.user_id, sessionUserId: userId });
  } catch {}

  if (post?.user_id !== userId) {
    throw new Error('Not authorized to edit this post')
  }

  const updates: { title?: string; content?: string | null; image_url?: string | null } = {}

  const title = formData.get('title') as string | null
  const content = formData.get('content') as string | null
  if (title !== null) updates.title = title
  if (content !== null) updates.content = content === '' ? null : content

  const image = formData.get('image') as File | null
  const removeImage = formData.get('removeImage')

  if (image && image instanceof File) {
    try {
      const image_url = await uploadImages(image)
      updates.image_url = image_url
    } catch (err) {
      // log but continue — if storage/upload fails we don't want to break
      // eslint-disable-next-line no-console
      console.error('uploadImages error', err)
    }
  } else if (removeImage) {
    updates.image_url = null
  }

    await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .throwOnError()

    redirect('/')
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("EditPost error:", err);
    throw err;
  }
}

export default EditPost
