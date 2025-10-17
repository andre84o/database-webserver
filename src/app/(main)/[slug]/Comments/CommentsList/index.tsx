// Fil: app/components/Comments/CommentsList.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/browser.client";

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
  // Svenska: Samma state som tidigare
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const supabaseRef = useRef<any>(null);

  // Svenska: Relativ tid i stil med sociala medier
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

  // Svenska: Avatar med initialer som reserv
  const Avatar = ({ name, src }: { name?: string; src?: string }) => {
    const safe = name && name.trim().length > 0 ? name : "Unknown"; // Svenska: visa username, annars "Unknown"
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

  // client-side fallback: if comments don't include users, fetch missing usernames in browser
  useEffect(() => {
    const missingAuthorIds = Array.from(
      new Set(
        comments
          .filter((c: any) => !c.users)
          .map((c: any) => c.author_id)
          .filter(Boolean)
      )
    );
    if (missingAuthorIds.length === 0) return;
    const supabase = createClient();
    (async () => {
      try {
        const { data: users } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .in("id", missingAuthorIds as any);
        const map = new Map<string, any>();
        (users ?? []).forEach((u: any) => map.set(String(u.id), u));
        setComments((prev) => prev.map((c) => ({ ...(c as any), users: c.users ?? map.get(String(c.author_id)) ?? null })));
      } catch (e) {
        // ignore fallback errors
        console.error('client-side users fetch error', e);
      }
    })();
  }, [comments]);

  const loadMore = () => setOffset((o) => o + limit);

  // Svenska: Optimistiska mutationer
  const handleDelete = async (commentId: number) => {
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== commentId));
    const res = await fetch(`/api/comments?comment_id=${commentId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Could not delete comment");
      setComments(prev);
    }
  };

  const handleEdit = async (id: number, newContent: string) => {
    const prev = comments;
    setComments((c) =>
      c.map((cm) => (cm.id === id ? { ...cm, content: newContent } : cm))
    );
    const res = await fetch(`/api/comments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: id, content: newContent }),
    });
    if (res.ok) {
      const json = await res.json();
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
    } else {
      alert("Could not edit comment");
      setComments(prev);
    }
  };

  // Svenska: Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingContent(c.content);
  };

  const submitEdit = (id: number) => {
    handleEdit(id, editingContent.trim());
    setEditingId(null);
  };

  // Svenska: Root och replies
  const rootComments = comments
    .filter((c) => !c.parent_id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const childrenMap = new Map<number, Comment[]>();
  comments
    .filter((c) => c.parent_id)
    .forEach((c) => {
      const arr = childrenMap.get(c.parent_id as number) ?? [];
      arr.push(c);
      childrenMap.set(c.parent_id as number, arr);
    });

  // Svenska: Enskild kommentar i social stil
  const CommentBubble = ({ c }: { c: Comment }) => {
    // Supabase may return the joined users as an object or as an array (depending on FK naming and RLS).
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

    const displayName = username && username.trim().length > 0 ? username : "Unknown";
    return (
      <div className="flex gap-2">
  <Avatar name={displayName} src={avatar_url ?? (c.users as any)?.avatar_url} />
        <div className="flex-1">
          <div className="inline-block rounded-2xl bg-slate-100 px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold hover:underline cursor-pointer">
                {displayName}
              </span>
              {/* Svenska: Tog bort "Edited" enligt din önskan */}
            </div>
            <p className="text-[15px] leading-5 whitespace-pre-wrap">
              {c.content}
            </p>
          </div>

          {/* Svenska: Actions-rad */}
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <button className="hover:underline">Like</button>
            <button className="hover:underline">Reply</button>
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

          {/* Svenska: Editläge */}
          {editingId === c.id && (
            <div className="mt-2">
              <textarea
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

        {rootComments.map((c) => {
          const replies = (childrenMap.get(c.id) ?? []).sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

          return (
            <div key={c.id}>
              <CommentBubble c={c} />
              {replies.length > 0 && (
                <div className="mt-2 ml-11 border-l border-slate-200 pl-3 space-y-3">
                  {replies.map((r) => (
                    <div key={r.id}>
                      <CommentBubble c={r} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={loadMore}
          className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium hover:bg-slate-200"
        >
          Load more
        </button>
      </div>
    </div>
  );
}
