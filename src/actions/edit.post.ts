"use server"

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import { uploadImages } from "@/utils/supabase/upload-images"
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const EditPost = async (formData: FormData) => {
  try {
    const postIdRaw = formData.get('postId')
    const postId = typeof postIdRaw === 'string' ? Number(postIdRaw) : Number(postIdRaw ?? NaN)

    const supabase = await createClient()

  const { data: post, error: postErr } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle();

  try {
    console.log('EditPost fetched post:', { post, postErr });
  } catch {}
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const userId = user?.id ?? null

  try {
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
      const image_url = await uploadImages(image, userId ?? undefined)
      updates.image_url = image_url
    } catch (err) {
      console.error('uploadImages error', err)
    }
  } else if (removeImage) {
    updates.image_url = null
  }

    const imageUrlToSet = updates.image_url;
    if (imageUrlToSet !== undefined) delete updates.image_url;

    await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .throwOnError();

    if (imageUrlToSet !== undefined) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const svc = createSupabaseClient(supabaseUrl, serviceKey);
      const { data: svcUpdated, error: svcErr } = await svc
        .from('posts')
        .update({ image_url: imageUrlToSet })
        .eq('id', postId)
        .select('id, image_url')
        .maybeSingle();
    }

    try {
      const { data: updated, error: updateErr } = await supabase.from('posts').select('id, image_url').eq('id', postId).maybeSingle();
    } catch (e) {
      console.error('EditPost update check failed', e);
    }

    redirect('/')
  } catch (err: any) {
    throw err;
  }
}

export default EditPost
