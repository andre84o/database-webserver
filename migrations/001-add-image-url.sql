-- Migration: add image_url column to posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS image_url text;

-- Optional: add an index if you will query by image_url (not necessary)
-- CREATE INDEX IF NOT EXISTS idx_posts_image_url ON public.posts (image_url);
