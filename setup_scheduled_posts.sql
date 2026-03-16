-- Scheduled Posts & Post Timestamps
-- Run this in the Supabase SQL Editor.

-- 1) Add scheduled_at column (for future publish date)
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NULL;

-- 2) Add updated_at column (tracks last save time)
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NULL DEFAULT timezone('utc', now());

-- 3) Index for the scheduler query (fetch due scheduled posts efficiently)
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at
  ON public.posts (scheduled_at)
  WHERE status = 'scheduled';

-- 4) Allow 'scheduled' as a valid status value (if posts table has a CHECK constraint)
-- If your posts table uses a CHECK constraint on status, run this to extend it:
-- (Safe to run even if no constraint exists currently)
DO $$
BEGIN
  ALTER TABLE public.posts
    DROP CONSTRAINT IF EXISTS posts_status_check;

  ALTER TABLE public.posts
    ADD CONSTRAINT posts_status_check
    CHECK (status IN ('draft', 'published', 'scheduled'));
EXCEPTION
  WHEN others THEN NULL; -- ignore if constraint doesn't exist
END $$;

-- 5) Function: publish all scheduled posts whose scheduled_at is in the past
--    Call this via pg_cron (e.g. every minute) or a Supabase Edge Function.
--    pg_cron example (run once after enabling the pg_cron extension):
--      SELECT cron.schedule('publish-scheduled-posts', '* * * * *',
--        $$UPDATE public.posts
--          SET status = 'published',
--              published_at = COALESCE(published_at, timezone('utc', now())),
--              scheduled_at = NULL
--          WHERE status = 'scheduled'
--            AND scheduled_at <= timezone('utc', now())$$
--      );
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.posts
  SET
    status       = 'published',
    published_at = COALESCE(published_at, timezone('utc', now())),
    scheduled_at = NULL,
    updated_at   = timezone('utc', now())
  WHERE
    status = 'scheduled'
    AND scheduled_at <= timezone('utc', now());

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- Grant execute to service_role (used by Edge Functions / pg_cron)
GRANT EXECUTE ON FUNCTION public.publish_scheduled_posts() TO service_role;
