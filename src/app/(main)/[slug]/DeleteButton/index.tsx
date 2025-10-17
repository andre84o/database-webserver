"use client";

import { useState, useTransition } from "react";
import DeletePost from "@/actions/delete.post";

const DeleteButton = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const openConfirm = () => setOpen(true);
  const closeConfirm = () => setOpen(false);

  const confirmDelete = () => {
    startTransition(async () => {
      await DeletePost(postId);
    });
  };

  return (
    <>
      <button onClick={openConfirm} className="button-tertiary" disabled={isPending}>
        {isPending ? "Deleting..." : "Delete Post"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeConfirm} />

          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm delete</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to permanently delete this post? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button onClick={closeConfirm} className="px-4 py-2 rounded-md border">Cancel</button>
              <button
                onClick={() => {
                  confirmDelete();
                  closeConfirm();
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
