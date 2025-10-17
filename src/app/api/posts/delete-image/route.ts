import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server-client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const postId = Number(body.postId);
    if (!Number.isFinite(postId)) return new NextResponse('Invalid postId', { status: 400 });

    const supabase = await createClient();
    const { data: post } = await supabase.from('posts').select('image_url').eq('id', postId).maybeSingle();
    const imageUrl: string | null | undefined = (post as any)?.image_url;
    if (!imageUrl) return NextResponse.json({ ok: true });

    let path: string | null = null;
    try {
      const u = new URL(imageUrl);
      const parts = u.pathname.split('/images/');
      path = parts.length > 1 ? parts[1] : null;
    } catch (e) {
      const idx = String(imageUrl).indexOf('/images/');
      path = idx >= 0 ? String(imageUrl).slice(idx + '/images/'.length) : null;
    }

    if (!path) return NextResponse.json({ ok: true });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const svc = createSupabaseClient(supabaseUrl, serviceKey);
    const { data: delData, error: delErr } = await svc.storage.from('images').remove([path]);
    if (delErr) {
      console.error('delete-image storage error', delErr);
      return new NextResponse(String(delErr?.message ?? delErr), { status: 500 });
    }

    const { data: updData, error: updErr } = await svc.from('posts').update({ image_url: null }).eq('id', postId).select('id').maybeSingle();
    if (updErr) {
      console.error('delete-image db update error', updErr);
      return new NextResponse(String(updErr?.message ?? updErr), { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('/api/posts/delete-image', err);
    return new NextResponse(String(err?.message ?? err), { status: 500 });
  }
}
