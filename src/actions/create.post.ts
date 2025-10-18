"use server"

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import { postSchema } from "./schemas"
import { z } from "zod"
import { uploadImages } from "@/utils/supabase/upload-images"
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const CreatePost = async (formData: FormData) => {
  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');

  const parsed = postSchema.partial().parse({
    title: typeof rawTitle === 'string' ? rawTitle.trim() || undefined : undefined,
    content: typeof rawContent === 'string' ? rawContent.trim() || undefined : undefined,
  })

  const supabase = await createClient()

  // Ensure title is present — postSchema.partial() allows undefined, but we need
  // a title to generate a slug and insert the post.
  if (!parsed.title) {
    // Surface a clear error instead of letting a TypeError occur later.
    throw new Error('Title is required')
  }

  const title = parsed.title as string
  const content = parsed.content as string | undefined
  const category = (formData.get('category') as string) || null

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) throw userErr

  const userId = user?.id ?? null

  let image_url: string | null = null
  const image = formData.get('image') as File | null
  if (image && image instanceof File) {
    image_url = await uploadImages(image)
  }

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  let slug = baseSlug
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).maybeSingle()
    if (!existing) break
    slug = `${baseSlug}-${counter++}`
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const svc = createSupabaseClient(supabaseUrl, serviceKey);

  const { data: inserted, error: insertErr } = await svc
    .from('posts')
    .insert({ title, content, slug, image_url, user_id: userId, category })
    .select('id, image_url, category')
    .maybeSingle();

  if (insertErr) throw insertErr;

  redirect('/')
}

export default CreatePost
