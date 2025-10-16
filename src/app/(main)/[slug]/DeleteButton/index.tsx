"use client";

import { useTransition } from "react";
import DeletePost from "@/actions/delete.post";

const DeleteButton = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await DeletePost(postId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="button-tertiary"
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Post"}
    </button>
  );
};

export default DeleteButton;
