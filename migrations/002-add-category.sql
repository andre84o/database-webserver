-- Add category column to posts if it doesn't exist
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS category text;
