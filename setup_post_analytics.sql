-- Analytics / content enrichment fields for posts
-- Run once against your Supabase database

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS custom_excerpt        TEXT,
  ADD COLUMN IF NOT EXISTS reading_time_override INTEGER,
  ADD COLUMN IF NOT EXISTS cta_block             TEXT,
  ADD COLUMN IF NOT EXISTS reference_links       TEXT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS internal_link_suggestions TEXT[] DEFAULT '{}';
