import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server-client';

export async function POST() {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Server signOut error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
