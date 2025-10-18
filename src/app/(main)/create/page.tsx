"use client";

import { useState } from "react";
import CustomSelect from "@/app/components/CustomSelect";
import { CATEGORY_OPTIONS } from "@/actions/category-options";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/providers/toast-provider";

const CreatePage = () => {
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const res = await fetch('/api/posts/create', { method: 'POST', body: fd });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Create failed');
      toast.push({ type: 'success', message: 'Saved' });
      if (json.result?.slug) router.push(`/${json.result.slug}`);
    } catch (err: any) {
      toast.push({ type: 'error', message: 'Create failed: ' + (err?.message ?? err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h1 className="font-bold text-2xl mb-4">Create Post</h1>

        <form id="create-post-form" onSubmit={onSubmit} className="space-y-6 pb-28 sm:pb-0">
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-center)]"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-center)]"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="image">
              Cover image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
            />

            <label htmlFor="image" className="bookmarkBtn">
              <span className="IconContainer">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span className="text">Image+</span>
            </label>
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="category">
              Category
            </label>
            <CustomSelect name="category" options={CATEGORY_OPTIONS as any} />
          </div>
          <div className="hidden sm:block">
            <button className="w-40 inline-block bg-neutral-900 text-white py-3 px-4 rounded-lg" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
      <div className="sm:hidden fixed left-4 right-4 bottom-4 z-50">
        <button
          form="create-post-form"
          type="submit"
          className="w-full bg-neutral-900 text-white py-3 rounded-lg shadow-lg"
          aria-label="Create post"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Create'}
        </button>
      </div>

    </div>
  );
};

export default CreatePage;
