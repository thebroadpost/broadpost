-- Post Settings / Visibility Migration
-- Run this in your Supabase SQL editor to add the new post settings columns.

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS visibility        TEXT    NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'password_protected')),
  ADD COLUMN IF NOT EXISTS post_password     TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS allow_comments    BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_pinned         BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS show_in_homepage  BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_in_newsletter BOOLEAN NOT NULL DEFAULT TRUE;

-- Ensure existing rows have sensible defaults (already handled by DEFAULT above,
-- but explicit for clarity on existing rows):
UPDATE public.posts
SET
  visibility         = COALESCE(visibility, 'public'),
  allow_comments     = COALESCE(allow_comments, TRUE),
  is_featured        = COALESCE(is_featured, FALSE),
  is_pinned          = COALESCE(is_pinned, FALSE),
  show_in_homepage   = COALESCE(show_in_homepage, TRUE),
  show_in_newsletter = COALESCE(show_in_newsletter, TRUE)
WHERE visibility IS NULL
   OR allow_comments IS NULL
   OR is_featured IS NULL
   OR is_pinned IS NULL
   OR show_in_homepage IS NULL
   OR show_in_newsletter IS NULL;
