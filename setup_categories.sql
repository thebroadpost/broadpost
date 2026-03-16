-- Seed default categories for BroadPost
-- Run this in your Supabase SQL editor to add the preset categories

INSERT INTO categories (name, slug, description, post_count)
VALUES
  ('Lifestyle',          'lifestyle',           'Fashion, wellness, travel, and more.',                   0),
  ('Tech & Innovation',  'tech-and-innovation', 'The latest in technology, startups, and innovation.',     0),
  ('Sports',             'sports',              'News, analysis, and highlights from the world of sports.',0),
  ('Entertainment',      'entertainment',       'Movies, music, TV, and celebrity news.',                  0),
  ('Business & Economy', 'business-and-economy','Markets, companies, and economic trends.',                0),
  ('Personal Finance',   'personal-finance',    'Investing, saving, budgeting, and financial planning.',   0),
  ('Politics & Policy',  'politics-and-policy', 'Government, elections, and public policy.',               0)
ON CONFLICT (slug) DO NOTHING;
