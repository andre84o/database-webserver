import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server-client'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const postId = form.get('postId')?.toString()
    if (!postId) return NextResponse.json({ error: 'missing postId' }, { status: 400 })

    const supabase = await createClient()
    const id = Number(postId)
    await supabase.from('posts').delete().eq('id', id).throwOnError()

    return NextResponse.redirect('/')
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
