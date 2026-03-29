-- Dashboard analytics hardening
-- Run this in Supabase SQL Editor (safe to re-run)

CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON public.post_views(viewed_at);

CREATE OR REPLACE FUNCTION public.get_dashboard_view_metrics_utc()
RETURNS TABLE(today_views BIGINT, days JSONB)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH bounds AS (
    SELECT
      date_trunc('day', timezone('utc', now()))::timestamp AS start_day,
      (date_trunc('day', timezone('utc', now())) + interval '6 day')::timestamp AS end_day,
      (date_trunc('day', timezone('utc', now())) + interval '1 day')::timestamp AS tomorrow
  ),
  day_series AS (
    SELECT generate_series(start_day, end_day, interval '1 day')::timestamp AS day_utc
    FROM bounds
  ),
  day_counts AS (
    SELECT
      ds.day_utc,
      COUNT(pv.id)::bigint AS views
    FROM day_series ds
    LEFT JOIN public.post_views pv
      ON pv.viewed_at >= ds.day_utc
      AND pv.viewed_at < ds.day_utc + interval '1 day'
    GROUP BY ds.day_utc
    ORDER BY ds.day_utc
  ),
  today_count AS (
    SELECT COUNT(*)::bigint AS value
    FROM public.post_views pv
    CROSS JOIN bounds b
    WHERE pv.viewed_at >= b.end_day
      AND pv.viewed_at < b.tomorrow
  )
  SELECT
    (SELECT value FROM today_count) AS today_views,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'day', to_char(day_utc, 'YYYY-MM-DD'),
          'views', views
        )
        ORDER BY day_utc
      )
      FROM day_counts
    ) AS days;
$$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_view_metrics_utc() TO authenticated;

-- Ensure admins (authenticated users) can read post_views.
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
END
$$;
