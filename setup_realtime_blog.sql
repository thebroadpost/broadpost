-- Real-time blog analytics and category counters
-- Run this in Supabase SQL Editor.

-- -----------------------------------------------------
-- 1) Track every post view event
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  viewer_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON public.post_views(viewed_at DESC);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'post_views'
      AND policyname = 'Anyone can insert post views'
  ) THEN
    CREATE POLICY "Anyone can insert post views"
    ON public.post_views
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'post_views'
      AND policyname = 'Authenticated can read post views'
  ) THEN
    CREATE POLICY "Authenticated can read post views"
    ON public.post_views
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- -----------------------------------------------------
-- 2) RPC for atomic view insert + aggregate increment
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_post_view(p_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.post_views(post_id, viewer_id)
  VALUES (p_post_id, auth.uid());

  UPDATE public.posts
  SET views = COALESCE(views, 0) + 1,
      updated_at = timezone('utc', now())
  WHERE id = p_post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_post_view(UUID) TO anon, authenticated;

-- -----------------------------------------------------
-- 3) Keep categories.post_count real and in sync
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.refresh_category_post_counts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.categories c
  SET post_count = COALESCE(src.cnt, 0)
  FROM (
    SELECT lower(trim(category)) AS category_slug, COUNT(*)::INT AS cnt
    FROM public.posts
    WHERE status = 'published'
    GROUP BY lower(trim(category))
  ) src
  WHERE lower(c.slug) = src.category_slug;

  UPDATE public.categories
  SET post_count = 0
  WHERE slug NOT IN (
    SELECT DISTINCT lower(trim(category))
    FROM public.posts
    WHERE status = 'published'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.on_posts_change_refresh_category_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.refresh_category_post_counts();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_category_counts_on_posts ON public.posts;
CREATE TRIGGER trg_refresh_category_counts_on_posts
AFTER INSERT OR UPDATE OR DELETE ON public.posts
FOR EACH STATEMENT
EXECUTE FUNCTION public.on_posts_change_refresh_category_count();

-- Run once now to initialize counts.
SELECT public.refresh_category_post_counts();
