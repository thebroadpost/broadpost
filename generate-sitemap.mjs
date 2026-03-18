#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get env variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    console.log('📄 Generating sitemap...');
    
    // Fetch all published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching posts:', error.message);
      process.exit(1);
    }

    // Base URLs
    const baseUrl = 'https://thebroadpost.com';
    const staticPages = [
      { loc: '/', changefreq: 'hourly', priority: '1.0', lastmod: new Date().toISOString().split('T')[0] },
      { loc: '/about', changefreq: 'monthly', priority: '0.5', lastmod: new Date().toISOString().split('T')[0] },
      { loc: '/category/business', changefreq: 'daily', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
      { loc: '/category/technology', changefreq: 'daily', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
      { loc: '/category/markets', changefreq: 'daily', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
      { loc: '/category/opinion', changefreq: 'daily', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
    ];

    // Build URLs array
    const urls = [
      ...staticPages,
      ...(posts || []).map(post => ({
        loc: `/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: (post.updated_at || post.published_at || new Date()).split('T')[0]
      }))
    ];

    // Generate XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Write to public/sitemap.xml
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
    
    console.log(`✅ Sitemap generated successfully with ${urls.length} URLs`);
    console.log(`   → ${posts?.length || 0} blog posts included`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
