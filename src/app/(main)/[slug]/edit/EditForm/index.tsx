// Fil: app/(main)/[slug]/edit/EditForm.tsx
"use client";

import { useRef, useState } from "react";

type Props = {
  postId: number;
  initialTitle?: string | null;
  initialContent?: string | null;
  initialImageUrl?: string | null;
};

const EditForm = ({
  postId,
  initialTitle,
  initialContent,
  initialImageUrl,
}: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex gap-2">
        <button type="submit" className="button-primary">
          Save
        </button>
      </div>
    </div>
  );
};

export default EditForm;
