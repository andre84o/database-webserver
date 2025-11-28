-- Remove unique constraint on title column to allow duplicate titles
ALTER TABLE IF EXISTS posts DROP CONSTRAINT IF EXISTS "Posts_title_key";
