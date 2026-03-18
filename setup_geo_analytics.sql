-- Geographic and source analytics for post views
-- Run this in Supabase SQL Editor after setup_realtime_blog.sql

ALTER TABLE public.post_views
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS country_name TEXT,
  ADD COLUMN IF NOT EXISTS source_referrer TEXT,
  ADD COLUMN IF NOT EXISTS source_domain TEXT,
  ADD COLUMN IF NOT EXISTS page_path TEXT;

CREATE INDEX IF NOT EXISTS idx_post_views_country_name ON public.post_views(country_name);
CREATE INDEX IF NOT EXISTS idx_post_views_source_domain ON public.post_views(source_domain);

CREATE OR REPLACE FUNCTION public.record_post_view_detailed(
  p_post_id UUID,
  p_country_code TEXT DEFAULT NULL,
  p_country_name TEXT DEFAULT NULL,
  p_source_referrer TEXT DEFAULT NULL,
  p_source_domain TEXT DEFAULT NULL,
  p_page_path TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.post_views(
    post_id,
    viewer_id,
    country_code,
    country_name,
    source_referrer,
    source_domain,
    page_path
  )
  VALUES (
    p_post_id,
    auth.uid(),
    NULLIF(trim(p_country_code), ''),
    NULLIF(trim(p_country_name), ''),
    NULLIF(trim(p_source_referrer), ''),
    NULLIF(trim(p_source_domain), ''),
    NULLIF(trim(p_page_path), '')
  );

  UPDATE public.posts
  SET views = COALESCE(views, 0) + 1,
      updated_at = timezone('utc', now())
  WHERE id = p_post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_post_view_detailed(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
