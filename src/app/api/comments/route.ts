import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function createSupabase(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
        },
      },
    }
  );
}
function loadServiceRoleKeyFromEnvFiles() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const root = process.cwd();
    const candidates = [path.join(root, ".env.local"), path.join(root, ".env")];
    for (const p of candidates) {
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf8");
      const lines = content.split(/\r?\n/);
      for (const l of lines) {
        const line = l.trim();
        if (!line || line.startsWith("#")) continue;
        const idx = line.indexOf("=");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key === "SUPABASE_SERVICE_ROLE_KEY" && val) return val;
      }
    }
  } catch (e) {
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("post_id");
  const limit = url.searchParams.get("limit") ?? "20";
  const offset = url.searchParams.get("offset") ?? "0";
  if (!postId) return NextResponse.json({ error: "post_id required" }, { status: 400 });

  const supabase = createSupabase(req) as any;
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(`id, post_id, parent_id, author_id, content, created_at, updated_at`)
      .eq("post_id", Number(postId))
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      console.error('Supabase comments select error:', error);
      return NextResponse.json({ error: error.message ?? error }, { status: 500 });
    }

    const comments = (data ?? []) as any[];
    if (comments.length === 0) return NextResponse.json({ data: comments });

    const authorIds = Array.from(new Set(comments.map((c) => c.author_id).filter(Boolean)));
    if (authorIds.length === 0) return NextResponse.json({ data: comments });

    let usersData: any = null;
    let usersErr: any = null;
    const serviceRoleKey = loadServiceRoleKeyFromEnvFiles();
    const hasServiceRole = !!serviceRoleKey;
    if (hasServiceRole) {
      try {
        const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey!);
        const usersRes = await admin.from('users').select('id, username').in('id', authorIds);
        usersData = usersRes.data;
        usersErr = usersRes.error;
      } catch (e: any) {
        console.error('GET /api/comments: admin users fetch exception', e);
        usersErr = e;
      }
    } else {
      const usersRes = await supabase.from('users').select('id, username').in('id', authorIds);
      usersData = usersRes.data;
      usersErr = usersRes.error;
    }

    if (usersErr) {
      console.error('Supabase users select error:', usersErr);
      const fallback = comments.map((c) => ({ ...c, users: null }));
      return NextResponse.json({ data: fallback });
    }

    const usersMap = new Map<string, any>();
    (usersData ?? []).forEach((u: any) => usersMap.set(String(u.id), u));

    const merged = comments.map((c) => ({
      ...c,
      users: usersMap.get(String(c.author_id)) ?? null,
    }));

    return NextResponse.json({ data: merged });
  } catch (err: any) {
    console.error('Unexpected GET /api/comments error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { post_id, content } = body;
  const parent_id = body.parent_id ? Number(body.parent_id) : null;
  if (!post_id || !content) return NextResponse.json({ error: "post_id and content required" }, { status: 400 });

  const supabase = createSupabase(req) as any;
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr }, { status: 500 });
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const insertObj: any = { post_id: Number(post_id), author_id: user.id, content };
  if (parent_id) insertObj.parent_id = parent_id;
  const { data, error } = await supabase.from("comments").insert(insertObj).select(`id, post_id, parent_id, author_id, content, created_at, updated_at`);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { comment_id, content } = body;
  if (!comment_id || !content) return NextResponse.json({ error: "comment_id and content required" }, { status: 400 });

  const supabase = createSupabase(req) as any;
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr }, { status: 500 });
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase.from("comments").select(`id, author_id`).eq("id", Number(comment_id)).maybeSingle();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.author_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase.from("comments").update({ content, updated_at: new Date().toISOString() }).eq("id", Number(comment_id)).select(`id, post_id, author_id, content, created_at, updated_at`);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const commentId = url.searchParams.get("comment_id");
  if (!commentId) return NextResponse.json({ error: "comment_id required" }, { status: 400 });

  const supabase = createSupabase(req) as any;
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr }, { status: 500 });
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase.from("comments").select(`id, author_id, post_id`).eq("id", Number(commentId)).maybeSingle();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.author_id === user.id) {
    await supabase.from("comments").delete().eq("id", Number(commentId));
    return NextResponse.json({ ok: true });
  }

  const { data: post } = await supabase.from("posts").select(`id, user_id`).eq("id", existing.post_id).maybeSingle();
  if (post && post.user_id === user.id) {
    await supabase.from("comments").delete().eq("id", Number(commentId));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
