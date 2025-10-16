"use server"

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import { uploadImages } from "@/utils/supabase/upload-images"

export const EditPost = async (formData: FormData) => {
  const postIdRaw = formData.get('postId')
  const postId = typeof postIdRaw === 'string' ? Number(postIdRaw) : Number(postIdRaw ?? NaN)

  const supabase = await createClient()

  // verify owner and fetch existing image_url
  const { data: post } = await supabase.from('posts').select('user_id,image_url').eq('id', postId).maybeSingle()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const userId = user?.id ?? null

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
    // upload new image and set image_url
    const image_url = await uploadImages(image)
    updates.image_url = image_url
  } else if (removeImage) {
    // remove image reference
    updates.image_url = null
  }

  await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .throwOnError()

  redirect('/')
}

export default EditPost
