ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS open_graph_title TEXT,
  ADD COLUMN IF NOT EXISTS open_graph_description TEXT,
  ADD COLUMN IF NOT EXISTS social_share_image TEXT;