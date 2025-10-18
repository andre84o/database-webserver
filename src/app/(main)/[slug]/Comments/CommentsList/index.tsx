"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/browser.client";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/app/components/providers/toast-provider";

type Comment = {
  id: number;
  post_id: number;
  parent_id?: number | null;
  author_id: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
  users?: { id?: string; username?: string; avatar_url?: string } | null;
};

export default function CommentsList({
  postId,
  postOwnerId,
}: {
  postId: number;
  postOwnerId?: string | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const supabaseRef = useRef<any>(null);

  const [replyToRootId, setReplyToRootId] = useState<number | null>(null);
  const [replyHintName, setReplyHintName] = useState<string>("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const editInputRef = useRef<HTMLTextAreaElement | null>(null);
  const toast = useToast();

  const relativeTime = (iso: string) => {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60000);
    if (Math.abs(mins) < 60) return rtf.format(-mins, "minute");
    const hours = Math.round(mins / 60);
    if (Math.abs(hours) < 24) return rtf.format(-hours, "hour");
    const days = Math.round(hours / 24);
    if (Math.abs(days) < 7) return rtf.format(-days, "day");
    const weeks = Math.round(days / 7);
    return rtf.format(-weeks, "week");
  };

  const Avatar = ({ name, src }: { name?: string; src?: string }) => {
    const safe = name && name.trim().length > 0 ? name : "Unknown";
    const initials =
      safe
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?";
    return (
      <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
        {src ? (
          <img src={src} alt={safe} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-slate-600">
            {initials}
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;
    supabase.auth
      .getUser()
      .then(({ data }) => setUserId(data.user?.id ?? null));

    const load = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/comments?post_id=${postId}&limit=${limit}&offset=${offset}`
      );
      const json = await res.json();
      setComments((prev) => {
        const map = new Map<number, Comment>();
        prev.forEach((p) => map.set(p.id, p));
        (json.data ?? []).forEach((c: Comment) => map.set(c.id, c));
        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`comments:post=${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload: any) => {
          const ev = payload.eventType;
          const newRow = payload.new as Comment;
          const oldRow = payload.old as Comment;
          if (ev === "INSERT" && newRow) setComments((c) => [newRow, ...c]);
          else if (ev === "UPDATE" && newRow)
            setComments((c) => c.map((x) => (x.id === newRow.id ? newRow : x)));
          else if (ev === "DELETE" && oldRow)
            setComments((c) => c.filter((x) => x.id !== oldRow.id));
        }
      )
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch {}
    };
  }, [postId, limit, offset]);

  const revalidateComments = async () => {
    try {
      const json = await apiFetch(`/api/comments?post_id=${postId}&limit=${limit}&offset=${offset}`);
      setComments((prev) => {
        const map = new Map<number, Comment>();
        prev.forEach((p) => map.set(p.id, p));
        (json.data ?? []).forEach((c: Comment) => map.set(c.id, c));
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } catch (e) {
      console.error('revalidateComments error', e);
    }
  };

  const loadedUserIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const unknownIds = Array.from(
      new Set(
        comments
          .filter((c: any) => !c.users)
          .map((c: any) => String(c.author_id))
      )
    ).filter((id) => !loadedUserIdsRef.current.has(id));
    if (unknownIds.length === 0) return;

    const supabase = createClient();
    (async () => {
      try {
        const { data: users } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .in("id", unknownIds as any);
        const map = new Map<string, any>();
        (users ?? []).forEach((u: any) => {
          map.set(String(u.id), u);
          loadedUserIdsRef.current.add(String(u.id));
        });
        setComments((prev) =>
          prev.map((c) => ({
            ...(c as any),
            users: c.users ?? map.get(String(c.author_id)) ?? null,
          }))
        );
      } catch (e) {
        console.error("client-side users fetch error", e);
      }
    })();
  }, [comments]);

  const loadMore = () => setOffset((o) => o + limit);

  const handleDelete = async (commentId: number) => {
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== commentId));
    try {
      await apiFetch(`/api/comments?comment_id=${commentId}`, { method: 'DELETE' });
    } catch (err: any) {
      toast.push({ type: 'error', message: 'Could not delete comment: ' + (err?.body?.message ?? err?.message) });
      setComments(prev);
    }
    revalidateComments();
  };

  const handleEdit = async (id: number, newContent: string) => {
    const prev = comments;
    setComments((c) =>
      c.map((cm) => (cm.id === id ? { ...cm, content: newContent } : cm))
    );
    try {
      const json = await apiFetch(`/api/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: id, content: newContent }),
      });
      const updated = json.data?.[0];
      setComments((c) =>
        c.map((cm) =>
          cm.id === id
            ? {
                ...cm,
                content: updated.content,
                updated_at: updated.updated_at,
              }
            : cm
        )
      );
      revalidateComments();
    } catch (err: any) {
      toast.push({ type: 'error', message: 'Could not edit comment: ' + (err?.body?.message ?? err?.message) });
      setComments(prev);
    }
  };

  const handleCreateReply = async (parentRootId: number, text: string) => {
    const content = text.trim();
    if (!content) return;

    const tempId = -Math.floor(Math.random() * 1_000_000);
    const optimistic: Comment = {
      id: tempId,
      post_id: postId,
      parent_id: parentRootId,
      author_id: userId ?? "unknown",
      content,
      created_at: new Date().toISOString(),
      users: { username: "You", avatar_url: undefined },
    };
    setComments((c) => [optimistic, ...c]);

    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        parent_id: parentRootId,
        content,
      }),
    });
    try {
      const json = await apiFetch(`/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentRootId,
          content,
        }),
      });
      const inserted: Comment | undefined = json.data?.[0];
      if (inserted)
        setComments((c) => [inserted, ...c.filter((x) => x.id !== tempId)]);
      setReplyDrafts((d) => ({ ...d, [parentRootId]: "" }));
      setReplyToRootId(null);
      setReplyHintName("");
      revalidateComments();
    } catch (err: any) {
      setComments((c) => c.filter((x) => x.id !== tempId));
      toast.push({ type: 'error', message: 'Could not post reply: ' + (err?.body?.message ?? err?.message) });
    }
  };

  const startEdit = (c: Comment) => {
    setReplyToRootId(null);
    setReplyHintName("");
    setEditingId(c.id);
    setEditingContent(c.content);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const submitEdit = (id: number) => {
    handleEdit(id, editingContent.trim());
    setEditingId(null);
  };

  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [editingId]);

  const rootComments = useMemo(
    () =>
      comments
        .filter((c) => !c.parent_id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
    [comments]
  );

  const childrenMap = useMemo(() => {
    const m = new Map<number, Comment[]>();
    comments
      .filter((c) => c.parent_id)
      .forEach((c) => {
        const arr = m.get(c.parent_id as number) ?? [];
        arr.push(c);
        m.set(c.parent_id as number, arr);
      });
    return m;
  }, [comments]);

  useEffect(() => {
    if (replyToRootId && !editingId) {
      setTimeout(() => replyInputRef.current?.focus(), 0);
    }
  }, [replyToRootId, editingId]);

  const CommentBubble = ({ c, rootId }: { c: Comment; rootId: number }) => {
    const rawUser = (c as any).users;
    let username: string | undefined = undefined;
    let avatar_url: string | undefined = undefined;
    if (rawUser) {
      if (Array.isArray(rawUser)) {
        username = rawUser[0]?.username;
        avatar_url = rawUser[0]?.avatar_url;
      } else if (typeof rawUser === "object") {
        username = rawUser.username;
        avatar_url = rawUser.avatar_url;
      }
    }
    const displayName =
      username && username.trim().length > 0 ? username : "Unknown";

    return (
      <div className="flex gap-2">
        <Avatar
          name={displayName}
          src={avatar_url ?? (c.users as any)?.avatar_url}
        />
        <div className="flex-1">
          <div className="inline-block rounded-2xl bg-slate-100 px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold hover:underline cursor-pointer">
                {displayName}
              </span>
            </div>
            <p className="text-[15px] leading-5 whitespace-pre-wrap">
              {c.content}
            </p>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            {userId && (
              <button
                className="hover:underline"
                onClick={() => {
                  setEditingId(null);
                  setReplyToRootId(rootId);
                  setReplyHintName(displayName);
                  setTimeout(() => replyInputRef.current?.focus(), 0);
                }}
              >
                Reply
              </button>
            )}
            <span>{relativeTime(c.created_at)}</span>

            {(userId === c.author_id || userId === postOwnerId) && (
              <>
                {userId === c.author_id && (
                  <button
                    onClick={() => startEdit(c)}
                    className="hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {editingId === c.id && (
            <div className="mt-2">
              <textarea
                ref={editInputRef}
                autoFocus
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                rows={3}
                placeholder="Edit your comment..."
                aria-label="Edit comment"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => submitEdit(c.id)}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ReplyForm = ({ parentRootId }: { parentRootId: number }) => {
    const value = replyDrafts[parentRootId] ?? "";
    return (
      <div className="mt-2 ml-11">
        <div className="flex items-start gap-2 rounded-2xl bg-slate-100 px-3 py-2">
          <textarea
            ref={replyInputRef}
            autoFocus
            value={value}
            onChange={(e) =>
              setReplyDrafts((d) => ({ ...d, [parentRootId]: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCreateReply(parentRootId, value);
              }
            }}
            rows={2}
            className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder={
              replyHintName
                ? `Reply to ${replyHintName}...`
                : "Write a reply..."
            }
            aria-label="Reply input"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => handleCreateReply(parentRootId, value)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Reply
          </button>
          <button
            onClick={() => {
              setReplyToRootId(null);
              setReplyHintName("");
              setReplyDrafts((d) => ({ ...d, [parentRootId]: "" }));
            }}
            className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h4 className="mb-3 font-semibold">Comments</h4>

      {loading && (
        <div className="text-sm text-slate-500">Loading comments...</div>
      )}

      <div className="space-y-4">
        {rootComments.length === 0 && !loading && (
          <div className="text-sm text-slate-500">No comments yet</div>
        )}

        {rootComments.map((root) => {
          const replies = (childrenMap.get(root.id) ?? []).sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

          return (
            <div key={root.id}>
              <CommentBubble c={root} rootId={root.id} />

              <div className="mt-2 ml-11 border-l border-slate-200 pl-3 space-y-3">
                {replies.map((r) => (
                  <div key={r.id}>
                    <CommentBubble c={r} rootId={root.id} />
                  </div>
                ))}

                {replyToRootId === root.id && (
                  <ReplyForm parentRootId={root.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setOffset((o) => o + limit)}
          className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium hover:bg-slate-200"
        >
          Load more
        </button>
      </div>
    </div>
  );
}
