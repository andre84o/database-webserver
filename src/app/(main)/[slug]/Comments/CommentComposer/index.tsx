"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/browser.client";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/providers/toast-provider";
import { apiFetch } from "@/utils/api";

export default function CommentComposer({ postId, parentId, onPosted }: { postId: number; parentId?: number | null; onPosted?: (newComment?: any) => void }) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [content]);

  const toast = useToast();
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) return router.push('/auth/login');
    if (!content.trim()) return;
    setPosting(true);
    const payload: any = { post_id: postId, content };
    if (parentId) payload.parent_id = parentId;

    try {
      const json = await apiFetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setContent('');
      onPosted?.(json.data?.[0]);
    } catch (err: any) {
      const msg = (err?.body?.message ?? err?.message) as string;
      toast.push({ type: 'error', message: 'Could not post comment: ' + (msg ?? '') });
    }
    setPosting(false);
  };
  const displayName = (
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'You'
  ) as string;

  return (
    <div className="max-w-2xl mx-auto mt-4">
      {user ? (
        <form onSubmit={submit} className="flex items-start gap-3">
          <div className="mt-1">
            <div className="h-10 w-10 rounded-full bg-[var(--brand-center)] flex items-center justify-center text-white font-semibold text-sm">
              {String(displayName)
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full resize-none bg-transparent outline-none text-sm leading-snug max-h-40"
                  rows={1}
                  placeholder={
                    parentId
                      ? `Reply as ${displayName}`
                      : `Comment as ${displayName}`
                  }
                  aria-label={parentId ? "Reply" : "New comment"}
                />
              </div>

              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="h-9 w-9 rounded-full bg-[var(--brand-center)] text-white flex items-center justify-center"
                  disabled={posting || !content.trim()}
                  aria-label="Send comment"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 2L11 13"
                    />
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 2l-7 20-4-9-9-4 20-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-sm text-slate-600">
          You must{" "}
          <a href="/auth/login" className="underline">
            log in
          </a>{" "}
          to comment.
        </div>
      )}
    </div>
  );
}
