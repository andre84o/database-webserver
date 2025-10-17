"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const CommentsList = dynamic(() => import("../CommentsList"), { ssr: false });
const CommentComposer = dynamic(() => import("../CommentComposer"), { ssr: false });

export default function CommentsClientWrapper({ postId, postOwnerId }: { postId: number; postOwnerId?: string | null }) {
  return (
    <Suspense fallback={<div>Loading comments...</div>}>
      <CommentComposer postId={postId} onPosted={() => { window.location.reload(); }} />
      <CommentsList postId={postId} postOwnerId={postOwnerId} />
    </Suspense>
  );
}
