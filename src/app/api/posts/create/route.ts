import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server-client';
import { uploadImages } from '@/utils/supabase/upload-images';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawTitle = formData.get('title');
    const rawContent = formData.get('content');

    const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
    if (!title) return NextResponse.json({ ok: false, message: 'Title is required' }, { status: 400 });

    const content = typeof rawContent === 'string' ? rawContent.trim() : null;
    const category = (formData.get('category') as string) || null;

    const supabase = await createClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    const userId = userData?.user?.id ?? null;

    let image_url: string | null = null;
    const image = formData.get('image') as File | null;
    if (image && image instanceof File) {
      image_url = await uploadImages(image);
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const svc = createSupabaseClient(supabaseUrl, serviceKey);

    const { data: inserted, error: insertErr } = await svc
      .from('posts')
      .insert({ title, content, slug, image_url, user_id: userId, category })
      .select('id, slug')
      .maybeSingle();

    if (insertErr) throw insertErr;

    return NextResponse.json({ ok: true, result: inserted });
  } catch (err: any) {
    console.error('/api/posts/create error:', err);
    return NextResponse.json({ ok: false, message: err?.message ?? 'Error' }, { status: 500 });
  }
}
