import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { EditPost } = await import("@/actions/edit.post");
    await EditPost(formData as unknown as FormData);
    return NextResponse.redirect(new URL("/", request.url));
  } catch (err: any) {
    console.error("/api/posts/edit error:", err);
    return new NextResponse(err?.message ?? "Error", { status: 500 });
  }
}
