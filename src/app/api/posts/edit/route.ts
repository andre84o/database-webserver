import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { updatePost } = await import("@/actions/edit.post");
    const result = await updatePost(formData as unknown as FormData);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("/api/posts/edit error:", err);
    return NextResponse.json({ ok: false, message: String(err?.message ?? "Error") }, { status: 500 });
  }
}
