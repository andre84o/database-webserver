"use server";

import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import { postSchema } from "./schemas";
import { z } from "zod";
import { uploadImages } from "@/utils/supabase/upload-images";

export const CreatePost = async (formData: FormData) => {
  const parsed = postSchema.partial().parse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  const supabase = await createClient();

  const title = parsed.title as string;
  const content = parsed.content as string | undefined;

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;

  const userId = user?.id ?? null;

  let image_url: string | null = null;
  const image = formData.get("image") as File | null;
  if (image && image instanceof File) {
    image_url = await uploadImages(image);
  }

  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  await supabase
    .from("posts")
    .insert({ title, content, slug, image_url, user_id: userId })
    .throwOnError();

  redirect("/");
};

export default CreatePost;
