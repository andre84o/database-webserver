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
      const image_url = await uploadImages(image, userId ?? undefined)
      updates.image_url = image_url
    } catch (err) {
      // log but continue — if storage/upload fails we don't want to break
      // eslint-disable-next-line no-console
      console.error('uploadImages error', err)
    }
  } else if (removeImage) {
    updates.image_url = null
  }

    // If we set image_url, perform that update with the service role to bypass RLS
    const imageUrlToSet = updates.image_url;
    // Remove image_url from the regular updates so session client updates only title/content
    if (imageUrlToSet !== undefined) delete updates.image_url;

    await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .throwOnError();

    if (imageUrlToSet !== undefined) {
      // use service role to set image_url (we already validated ownership above)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const svc = createSupabaseClient(supabaseUrl, serviceKey);
      const { data: svcUpdated, error: svcErr } = await svc
        .from('posts')
        .update({ image_url: imageUrlToSet })
        .eq('id', postId)
        .select('id, image_url')
        .maybeSingle();
      // eslint-disable-next-line no-console
      console.log('EditPost service-role update result:', { svcUpdated, svcErr });
    }

    // Log update result explicitly
    try {
      const { data: updated, error: updateErr } = await supabase.from('posts').select('id, image_url').eq('id', postId).maybeSingle();
      // eslint-disable-next-line no-console
      console.log('EditPost update result:', { updated, updateErr });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('EditPost update check failed', e);
    }

    redirect('/')
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("EditPost error:", err);
    throw err;
  }
}

export default EditPost
