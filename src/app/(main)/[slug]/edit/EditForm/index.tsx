"use client";

import { useRef, useState, startTransition } from "react";
import CustomSelect from "@/app/components/CustomSelect";
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
    <form
      id="edit-post-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="postId" value={String(postId)} />

      <label className="flex flex-col">
        <span className="font-medium">Title</span>
        <input
          name="title"
          defaultValue={initialTitle ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Content</span>
        <textarea
          name="content"
          defaultValue={initialContent ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[160px]"
        />
      </label>

      <div className="flex flex-col">
        <span className="font-medium">Image</span>

        {imagePreview && (
          <div className="relative mb-2">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full max-h-56 object-cover rounded"
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
          id="image"
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
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

        <label htmlFor="image" className="bookmarkBtn">
          <span className="IconContainer">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <p className="text">Save</p>
        </label>

        {removeImage && <input type="hidden" name="removeImage" value="on" />}
      </div>

      <label className="flex flex-col">
        <span className="font-medium">Category</span>
        <CustomSelect
          name="category"
          defaultValue={initialCategory ?? ""}
          options={[
            { value: "", label: "Select a category" },
            { value: "Food", label: "Food" },
            { value: "Politics", label: "Politics" },
            { value: "Travel", label: "Travel" },
            { value: "Inspiration", label: "Inspiration" },
            { value: "News", label: "News" },
            { value: "Food & Recipes", label: "Food & Recipes" },
            { value: "Photo & Design", label: "Photo & Design" },
            { value: "Productivity", label: "Productivity" },
          ]}
        />
      </label>

      <div className="hidden sm:flex gap-2">
        <button type="submit" className="button-primary">
          Save
        </button>
      </div>

      <div className="sm:hidden fixed left-4 right-4 bottom-4 z-50">
        <button
          form="edit-post-form"
          type="submit"
          className="w-full bg-neutral-900 text-white py-3 rounded-lg shadow-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
