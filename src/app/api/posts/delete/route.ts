import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server-client'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const postId = form.get('postId')?.toString()
  if (!postId) return NextResponse.json({ ok: false, message: 'missing postId' }, { status: 400 })

    const supabase = await createClient()
    const id = Number(postId)

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
  if (userErr) return NextResponse.json({ ok: false, message: String(userErr?.message ?? userErr) }, { status: 500 })
  if (!user) return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 })

    const { data: post, error: postErr } = await supabase.from('posts').select('id, user_id').eq('id', id).maybeSingle()
  if (postErr) return NextResponse.json({ ok: false, message: String(postErr?.message ?? postErr) }, { status: 500 })
  if (!post) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 })

    if (String(post.user_id) !== String(user.id)) {
  return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })
    }

    await supabase.from('posts').delete().eq('id', id).throwOnError()

    return NextResponse.redirect('/')
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 })
  }
}
