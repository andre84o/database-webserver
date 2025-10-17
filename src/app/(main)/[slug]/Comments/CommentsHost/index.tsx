"use client";

import CommentsClientWrapper from "../CommentsClientWrapper";

export default function CommentsHost({ postId, postOwnerId }: { postId: number; postOwnerId?: string | null }) {
  return <CommentsClientWrapper postId={postId} postOwnerId={postOwnerId} />;
}
