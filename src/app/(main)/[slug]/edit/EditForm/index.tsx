"use client";

import { useState } from "react";

type Props = {
  postId: number;
  initialTitle?: string | null;
  initialContent?: string | null;
  initialImageUrl?: string | null;
  action: (formData: FormData) => Promise<any>;
};

const EditForm = ({
  postId,
  initialTitle,
  initialContent,
  initialImageUrl,
  action,
}: Props) => {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [content, setContent] = useState(initialContent ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={
        action as unknown as string | ((formData: FormData) => Promise<any>)
      }
      onSubmit={() => setLoading(true)}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="postId" value={String(postId)} />
      <label className="flex flex-col">
        <span className="font-medium">Title</span>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Content</span>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea"
        />
      </label>

      <label className="flex flex-col">
        <span className="font-medium">Image</span>
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-48 rounded"
            />
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImagePreview(URL.createObjectURL(file));
            setRemoveImage(false);
          }}
        />
        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="removeImage"
            checked={removeImage}
            onChange={(e) => {
              setRemoveImage(e.target.checked);
              if (e.target.checked) setImagePreview(null);
            }}
          />
          <span>Remove existing image</span>
        </label>
      </label>

      <div className="flex gap-2">
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditForm;
