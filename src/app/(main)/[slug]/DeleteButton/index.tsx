"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/providers/toast-provider";

const DeleteButton = ({ postId }: { postId: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const openConfirm = () => setOpen(true);
  const closeConfirm = () => setOpen(false);

  const confirmDelete = async () => {
    setIsPending(true);
    try {
      const fd = new FormData();
      fd.append('postId', postId);
      const res = await fetch('/api/posts/delete', { method: 'POST', body: fd });
      const json = await res.json();
      
      if (!json.ok) {
        throw new Error(json.message || 'Delete failed');
      }
      
      toast.push({ type: 'success', message: 'Post deleted successfully' });
      router.push('/');
    } catch (err: any) {
      toast.push({ type: 'error', message: 'Failed to delete post: ' + (err?.message ?? err) });
    } finally {
      setIsPending(false);
      closeConfirm();
    }
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
            <h3 className="text-xl font-bold mb-4">Delete Post</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete this post? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeConfirm} 
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
