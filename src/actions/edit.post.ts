"use server"

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import { uploadImages } from "@/utils/supabase/upload-images"
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const CategoryEnum = z.enum([
  "Food",
  "Politics",
  "Travel",
  "Inspiration",
  "News",
  "Food & Recipes",
  "Photo & Design",
  "Productivity",
]);

export async function updatePost(formData: FormData) {
  const postIdRaw = formData.get('postId')
  const postId = typeof postIdRaw === 'string' ? Number(postIdRaw) : Number(postIdRaw ?? NaN)

    const supabase = await createClient()

    const { data: post, error: postErr } = await supabase
      .from('posts')
      .select('user_id, image_url')
      .eq('id', postId)
      .maybeSingle();

    console.log('EditPost fetched post:', { post, postErr });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr) throw userErr
    const userId = user?.id ?? null

    console.log("EditPost owner check", { postId, postUserId: (post as any)?.user_id, sessionUserId: userId });

    if (post?.user_id !== userId) {
      throw new Error('Not authorized to edit this post')
    }

    const updates: { title?: string; content?: string | null; category?: string | null } = {}

    const title = formData.get('title') as string | null
    const content = formData.get('content') as string | null
    const categoryRaw = formData.get('category')

    if (title !== null) updates.title = title
    if (content !== null) updates.content = content === '' ? null : content

    if (categoryRaw !== null) {
      const categoryStr = String(categoryRaw).trim()
      if (categoryStr === '') {
        updates.category = null
      } else {
        const ok = CategoryEnum.parse(categoryStr)
        updates.category = ok
      }
    }

    let imageUrlToSet: string | null | undefined = undefined
    const image = formData.get('image') as File | null
    const removeImage = formData.get('removeImage')

    const extractPathFromPublicUrl = (url?: string | null) => {
      if (!url) return null;
      try {
        const u = new URL(url);
        const parts = u.pathname.split('/images/');
        return parts.length > 1 ? parts[1] : null;
      } catch (e) {
        const idx = String(url).indexOf('/images/');
        return idx >= 0 ? String(url).slice(idx + '/images/'.length) : null;
      }
    }

    if (image && image instanceof File) {
      try {
        imageUrlToSet = await uploadImages(image, userId ?? undefined)
        console.log('upload-images upload result, imageUrlToSet:', imageUrlToSet)
        const oldPath = extractPathFromPublicUrl((post as any)?.image_url);
        if (oldPath) {
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const svc = createSupabaseClient(supabaseUrl, serviceKey);
            const { data: delData, error: delErr } = await svc.storage.from('images').remove([oldPath]);
            if (delErr) console.error('failed to delete old image from storage', delErr);
            else console.log('deleted old image from storage', { oldPath, delData });
          } catch (e) {
            console.error('error deleting old image', e);
          }
        }
      } catch (err) {
        console.error('uploadImages error', err)
      }
    } else if (removeImage) {
      const oldPath = extractPathFromPublicUrl((post as any)?.image_url);
      if (oldPath) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const svc = createSupabaseClient(supabaseUrl, serviceKey);
          const { data: delData, error: delErr } = await svc.storage.from('images').remove([oldPath]);
          if (delErr) console.error('failed to delete image from storage', delErr);
          else console.log('deleted image from storage', { oldPath, delData });
        } catch (e) {
          console.error('error deleting image', e);
        }
      }
      imageUrlToSet = null
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateErr } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .throwOnError();
      if (updateErr) {
        console.error('EditPost session update error', updateErr)
      }
    }

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
      if (svcErr) console.error('EditPost service update error', svcErr)
    }

    try {
      const { data: updated, error: updErr } = await supabase.from('posts').select('id, image_url, category').eq('id', postId).maybeSingle();
      console.log('EditPost after update:', { updated, updErr })
    } catch (e) {
      console.error('EditPost update check failed', e);
    }

  try {
    const { data: updated, error: updErr } = await createClient().then(s => s.from('posts').select('id, image_url, category, title, slug').eq('id', postId).maybeSingle());
    return { updated, updErr };
  } catch (e) {
    return { updated: null, updErr: e };
  }
}

export const EditPost = async (formData: FormData) => {
  const res = await updatePost(formData);
  redirect('/');
}

export default EditPost
