"use client";

import { useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: number;
  initialTitle?: string | null;
  initialContent?: string | null;
  initialImageUrl?: string | null;
  initialCategory?: string | null;
};

const EditForm = ({
  postId,
  initialTitle,
  initialContent,
  initialImageUrl,
  initialCategory,
}: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleRemoveImage = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    try {
      const res = await fetch('/api/posts/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Failed to delete image via API', txt);
        alert('Could not delete image on server: ' + txt);
      }
    } catch (err) {
      console.error('Error calling delete-image API', err);
      alert('Error deleting image');
    }
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/posts/edit', { method: 'POST', body: fd });
      if (!res.ok) {
        const txt = await res.text();
        alert('Save failed: ' + txt);
        return;
      }
      startTransition(() => {
        router.replace('/');
        router.refresh();
      });
    } catch (err) {
      console.error('Save error', err);
      alert('Save error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="postId" value={String(postId)} />

      <label className="flex flex-col">
        <span className="font-medium">Title</span>
        <input
          name="title"
          defaultValue={initialTitle ?? ""}
          className="input"
        />
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Content</span>
        <textarea
          name="content"
          defaultValue={initialContent ?? ""}
          className="textarea"
        />
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Image</span>

        {imagePreview && (
          <div className="relative mb-2 inline-block">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-48 rounded"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 rounded-full px-2 h-6 inline-flex items-center justify-center text-white bg-black/60 hover:bg-black/70 text-xs"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) {
              const maxBytes = 5 * 1024 * 1024;
              if (file.size > maxBytes) {
                alert(
                  "File is too large (max 5 MB). Please choose a smaller file."
                );
                e.currentTarget.value = "";
                return;
              }
              setImagePreview(URL.createObjectURL(file));
              setRemoveImage(false); 
            }
          }}
        />

        {removeImage && <input type="hidden" name="removeImage" value="on" />}
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Category</span>
        <select name="category" defaultValue={initialCategory ?? ""} className="w-full border border-gray-300 rounded px-3 py-2">
          <option value="">Select a category</option>
          <option>Food</option>
          <option>Politics</option>
          <option>Travel</option>
          <option>Inspiration</option>
          <option>News</option>
          <option>Food &amp; Recipes</option>
          <option>Photo &amp; Design</option>
          <option>Productivity</option>
        </select>
      </label>

      <div className="flex gap-2">
        <button type="submit" className="button-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
