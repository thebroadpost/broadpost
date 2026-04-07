import { supabase } from './supabase';
import { AnalyticsWindow, PaginationParams } from '../types';
import { generateSlug } from './utils';
import { getCategoryMatchVariants, toCanonicalCategorySlug } from './categories';

function titleCase(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePost(raw: any): any {
  const rawCategory = (raw?.category || '').toString().trim();
  const categorySlug = rawCategory ? toCanonicalCategorySlug(rawCategory) : 'news';

  return {
    ...raw,
    category_id: raw?.category_id || categorySlug,
    author_id: raw?.author_id || '',
    published_at: raw?.status === 'published' ? (raw?.published_at || raw?.created_at || null) : (raw?.published_at || null),
    scheduled_at: raw?.scheduled_at || null,
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    category: {
      id: categorySlug,
      slug: categorySlug,
      name: rawCategory ? titleCase(categorySlug) : 'News',
      description: null,
    },
    author: {
      name: raw?.author_name || raw?.author?.full_name || 'Staff',
      avatar_url: raw?.author_avatar || raw?.author?.avatar_url || null,
      bio: raw?.author_bio || null,
    },
  };
}

function missingColumnFromError(error: any): string | null {
  return error?.message?.match(/'([^']+)' column/)?.[1] || null;
}

function categoryVariants(categorySlug: string): string[] {
  return getCategoryMatchVariants(categorySlug);
}

function normalizeOptionalText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function extractSeoFields(postData: any) {
  return {
    seo_title: normalizeOptionalText(postData.seo_title),
    meta_description: normalizeOptionalText(postData.meta_description),
    focus_keyword: normalizeOptionalText(postData.focus_keyword),
    canonical_url: normalizeOptionalText(postData.canonical_url),
    open_graph_title: normalizeOptionalText(postData.open_graph_title),
    open_graph_description: normalizeOptionalText(postData.open_graph_description),
    social_share_image: normalizeOptionalText(postData.social_share_image),
  };
}

type ViewMeta = {
  country_code?: string | null;
  country_name?: string | null;
  source_referrer?: string | null;
  source_domain?: string | null;
  page_path?: string | null;
};

async function getViewMeta(): Promise<ViewMeta> {
  if (typeof window === 'undefined') {
    return {};
  }

  const referrer = document.referrer || null;
  const sourceDomain = referrer ? (() => {
    try {
      return new URL(referrer).hostname;
    } catch {
      return null;
    }
  })() : null;

  const baseMeta: ViewMeta = {
    source_referrer: referrer,
    source_domain: sourceDomain,
    page_path: window.location.pathname || null,
  };

  try {
    const cached = window.sessionStorage.getItem('broadpost_geo_meta');
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...baseMeta,
        country_code: parsed.country_code || null,
        country_name: parsed.country_name || null,
      };
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return baseMeta;
    }

    const geo = await response.json();
    const country_code = geo?.country_code ? String(geo.country_code) : null;
    const country_name = geo?.country_name ? String(geo.country_name) : null;

    window.sessionStorage.setItem('broadpost_geo_meta', JSON.stringify({ country_code, country_name }));

    return {
      ...baseMeta,
      country_code,
      country_name,
    };
  } catch {
    return baseMeta;
  }
}

const POST_SELECT = '*';

export async function getPosts(filters?: { status?: string, category_slug?: string, author_name?: string }, pagination?: PaginationParams) {
  let query = supabase.from('posts').select(POST_SELECT, { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.category_slug) {
    query = query.in('category', categoryVariants(filters.category_slug));
  }
  if (filters?.author_name) {
    query = query.ilike('author_name', filters.author_name);
  }

  query = query.order('created_at', { ascending: false });

  if (pagination) {
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data || []).map(normalizePost), count };
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return normalizePost(data);
}

export async function getPostsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .in('category', categoryVariants(categorySlug))
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function getFeaturedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function getHomepageHeroPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;

  const posts = (data || []).map(normalizePost);
  const homepagePosts = posts.filter((post: any) => post.show_in_homepage ?? true);
  const pinnedHomepagePosts = homepagePosts.filter((post: any) => post.is_pinned);
  const nonPinnedHomepagePosts = homepagePosts.filter((post: any) => !post.is_pinned);

  const selected = [...pinnedHomepagePosts, ...nonPinnedHomepagePosts].slice(0, 4);
  if (selected.length === 4) {
    return selected;
  }

  const selectedIds = new Set(selected.map((post: any) => post.id));
  const remaining = posts.filter((post: any) => !selectedIds.has(post.id));
  return [...selected, ...remaining].slice(0, 4);
}

export async function getTrendingPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function incrementViews(postId: string) {
  const viewMeta = await getViewMeta();

  const detailedRpcResult = await supabase.rpc('record_post_view_detailed', {
    p_post_id: postId,
    p_country_code: viewMeta.country_code || null,
    p_country_name: viewMeta.country_name || null,
    p_source_referrer: viewMeta.source_referrer || null,
    p_source_domain: viewMeta.source_domain || null,
    p_page_path: viewMeta.page_path || null,
  });
  if (!detailedRpcResult.error) return;

  const rpcResult = await supabase.rpc('record_post_view', { p_post_id: postId });
  if (!rpcResult.error) return;

  // If RPCs are unavailable, still try to record an event row directly.
  await supabase.from('post_views').insert([
    {
      post_id: postId,
      country_code: viewMeta.country_code || null,
      country_name: viewMeta.country_name || null,
      source_referrer: viewMeta.source_referrer || null,
      source_domain: viewMeta.source_domain || null,
      page_path: viewMeta.page_path || null,
    },
  ]);

  // Fallback for projects that have not run the view tracking SQL yet.
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('views')
    .eq('id', postId)
    .single();
    
  if (fetchError) return;

  await supabase
    .from('posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', postId);
}

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('approved', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((comment: any) => ({
    ...comment,
    name: comment.name || comment.author_name || 'Reader',
  }));
}

export async function addComment(commentData: { post_id: string, name: string, content: string }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: commentData.post_id,
        author_name: commentData.name,
        content: commentData.content,
        approved: true,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function createCategory(input: { name: string; description?: string | null }) {
  const name = input.name.trim();
  if (!name) throw new Error('Category name is required');

  const slug = generateSlug(name);
  if (!slug) throw new Error('Category name is invalid');

  const payload: Record<string, any> = {
    name: titleCase(slug),
    slug,
    description: input.description ?? null,
    post_count: 0,
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();

    if (!error) return data;

    if (error.code === '23505') {
      throw new Error('Category already exists');
    }

    const missingColumn = missingColumnFromError(error);
    if (!missingColumn || !(missingColumn in payload)) {
      throw error;
    }

    delete payload[missingColumn];
  }

  throw new Error('Failed to create category');
}

// ADMIN FUNCTIONS
export async function createPost(postData: any) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const canonicalCategory = toCanonicalCategorySlug((postData.category || '').toString());

  const payload: Record<string, any> = {
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    excerpt: postData.excerpt,
    cover_image: postData.cover_image,
    category: canonicalCategory,
    tags: postData.tags || [],
    status: postData.status,
    author_name: postData.author_name || userData.user.user_metadata?.full_name || 'Staff',
    author_avatar: postData.author_avatar || userData.user.user_metadata?.avatar_url || null,
    author_bio: postData.author_bio || null,
    visibility: postData.visibility || 'public',
    post_password: postData.post_password || null,
    allow_comments: postData.allow_comments ?? true,
    is_featured: postData.is_featured ?? false,
    is_pinned: postData.is_pinned ?? false,
    show_in_homepage: postData.show_in_homepage ?? true,
    show_in_newsletter: postData.show_in_newsletter ?? true,
    ...extractSeoFields(postData),
    views: postData.views || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: userData.user.id,
    category_id: postData.category_id || canonicalCategory,
    published_at: postData.status === 'published' ? (postData.published_at || new Date().toISOString()) : null,
    scheduled_at: postData.status === 'scheduled' ? (postData.scheduled_at || null) : null,
  };
  let data: any = null;
  let error: any = null;

  // Retry a few times by removing columns that don't exist in this project's schema.
  for (let attempt = 0; attempt < 5; attempt++) {
    const result = await supabase
      .from('posts')
      .insert([payload])
      .select()
      .single();

    data = result.data;
    error = result.error;

    if (!error) break;

    const missingColumn = missingColumnFromError(error);
    if (!missingColumn || !(missingColumn in payload)) {
      break;
    }

    delete payload[missingColumn];
  }

  if (error) throw error;
  return normalizePost(data);
}

export async function updatePost(postId: string, postData: any) {
  const canonicalCategory = postData?.category
    ? toCanonicalCategorySlug((postData.category || '').toString())
    : undefined;

  const payload: Record<string, any> = {
    ...postData,
    ...(canonicalCategory ? { category: canonicalCategory } : {}),
    ...extractSeoFields(postData),
    updated_at: new Date().toISOString(),
  };
  let data: any = null;
  let error: any = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const result = await supabase
      .from('posts')
      .update(payload)
      .eq('id', postId)
      .select()
      .single();

    data = result.data;
    error = result.error;

    if (!error) break;

    const missingColumn = missingColumnFromError(error);
    if (!missingColumn || !(missingColumn in payload)) {
      break;
    }

    delete payload[missingColumn];
  }

  if (error) throw error;
  return normalizePost(data);
}

export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
  return true;
}

export async function togglePublish(postId: string, isPublished: boolean) {
  const status = isPublished ? 'published' : 'draft';
  const payload: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
    published_at: isPublished ? new Date().toISOString() : null,
  };

  for (let attempt = 0; attempt < 4; attempt++) {
    const { data, error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', postId)
      .select()
      .single();

    if (!error) return normalizePost(data);

    const missingColumn = missingColumnFromError(error);
    if (!missingColumn || !(missingColumn in payload)) {
      throw error;
    }

    delete payload[missingColumn];
  }

  throw new Error('Failed to toggle publish state');
}

export async function getAdminStats(window: AnalyticsWindow = '7d') {
  const nowUtc = new Date();

  const utcDayStart = new Date(Date.UTC(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth(),
    nowUtc.getUTCDate()
  ));

  const utcHourStart = new Date(Date.UTC(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth(),
    nowUtc.getUTCDate(),
    nowUtc.getUTCHours()
  ));

  let startDateUtc = utcDayStart;
  let endDateUtcExclusive = new Date(utcDayStart.getTime() + (24 * 60 * 60 * 1000));
  let bucketMode: 'hour' | 'day' | 'week' = 'day';

  const endOfTodayUtc = new Date(Date.UTC(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth(),
    nowUtc.getUTCDate() + 1
  ));

  if (window === '24h') {
    startDateUtc = new Date(utcHourStart.getTime() - (23 * 60 * 60 * 1000));
    endDateUtcExclusive = new Date(utcHourStart.getTime() + (60 * 60 * 1000));
    bucketMode = 'hour';
  } else if (window === '1m') {
    startDateUtc = new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate() - 29));
    endDateUtcExclusive = endOfTodayUtc;
    bucketMode = 'day';
  } else if (window === '3m') {
    startDateUtc = new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate() - 89));
    endDateUtcExclusive = endOfTodayUtc;
    bucketMode = 'week';
  } else {
    startDateUtc = new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate() - 6));
    endDateUtcExclusive = endOfTodayUtc;
    bucketMode = 'day';
  }

  const toDayKey = (d: Date): string => d.toISOString().slice(0, 10);
  const toHourKey = (d: Date): string => d.toISOString().slice(0, 13);
  const startOfUtcWeek = (d: Date): Date => {
    const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const mondayOffset = (copy.getUTCDay() + 6) % 7;
    copy.setUTCDate(copy.getUTCDate() - mondayOffset);
    return copy;
  };
  const toWeekKey = (d: Date): string => toDayKey(startOfUtcWeek(d));

  const [
    totalPostsRes,
    publishedPostsRes,
    draftPostsRes,
    totalCommentsRes,
    postsForViewsRes,
    todayViewsRes,
    geoViewEventsRes,
    recentPostsRes,
    publishedCategoriesRes,
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('views'),
    supabase
      .from('post_views')
      .select('id', { count: 'exact', head: true })
      .gte('viewed_at', new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate())).toISOString())
      .lt('viewed_at', endOfTodayUtc.toISOString()),
    supabase
      .from('post_views')
      .select('country_name, source_domain, post_id, post:post_id (title, slug)')
      .order('viewed_at', { ascending: false })
      .limit(3000),
    supabase
      .from('posts')
      .select('id,title,slug,category,views,status,created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('posts').select('category').eq('status', 'published'),
  ]);

  // Supabase returns a maximum number of rows per request, so fetch in pages
  // to avoid dropping recent events in busy windows (7D/1M/3M).
  const viewEventsData: { viewed_at: string }[] = [];
  let viewEventsError: any = null;
  const pageSize = 1000;
  const maxRows = 100000;

  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const { data, error } = await supabase
      .from('post_views')
      .select('viewed_at')
      .gte('viewed_at', startDateUtc.toISOString())
      .lt('viewed_at', endDateUtcExclusive.toISOString())
      .order('viewed_at', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) {
      viewEventsError = error;
      break;
    }

    if (!data || data.length === 0) {
      break;
    }

    viewEventsData.push(...data);

    if (data.length < pageSize) {
      break;
    }
  }

  const viewsDataMap = new Map<string, number>();

  if (bucketMode === 'hour') {
    for (let i = 0; i < 24; i++) {
      const d = new Date(startDateUtc.getTime() + (i * 60 * 60 * 1000));
      viewsDataMap.set(toHourKey(d), 0);
    }
  } else if (bucketMode === 'day') {
    const totalDays = window === '1m' ? 30 : 7;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(Date.UTC(
        startDateUtc.getUTCFullYear(),
        startDateUtc.getUTCMonth(),
        startDateUtc.getUTCDate() + i
      ));
      viewsDataMap.set(toDayKey(d), 0);
    }
  } else {
    const cursor = new Date(Date.UTC(startDateUtc.getUTCFullYear(), startDateUtc.getUTCMonth(), startDateUtc.getUTCDate()));
    const endCursor = new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate()));
    while (cursor <= endCursor) {
      viewsDataMap.set(toWeekKey(cursor), 0);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  if (!viewEventsError && viewEventsData.length > 0) {
    for (const row of viewEventsData) {
      const viewedAt = new Date(row.viewed_at);
      const key = bucketMode === 'hour'
        ? toHourKey(viewedAt)
        : bucketMode === 'week'
          ? toWeekKey(viewedAt)
          : toDayKey(viewedAt);
      if (viewsDataMap.has(key)) {
        viewsDataMap.set(key, (viewsDataMap.get(key) || 0) + 1);
      }
    }
  }

  const viewsData = Array.from(viewsDataMap.entries()).map(([bucketKey, views]) => {
      const normalizedIso = bucketMode === 'hour' ? `${bucketKey}:00:00Z` : `${bucketKey}T00:00:00Z`;
      const d = new Date(normalizedIso);

      let label = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      if (bucketMode === 'hour') {
        label = d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' });
      } else if (window === '1m') {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      } else if (bucketMode === 'week') {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      }

      return {
        date: label,
        views,
      };
    });

  let rpcTodayViews: number | null = null;
  let rpcTodayViewsFromDays: number | null = null;

  const rpcMetricsRes = await supabase.rpc('get_dashboard_view_metrics_utc');
  if (!rpcMetricsRes.error && Array.isArray(rpcMetricsRes.data) && rpcMetricsRes.data[0]) {
    const row = rpcMetricsRes.data[0] as { today_views?: number; days?: Array<{ day: string; views: number }> };
    rpcTodayViews = Number(row.today_views || 0);

    if (Array.isArray(row.days)) {
      const todayDay = row.days.find((item) => item.day === nowUtc.toISOString().slice(0, 10));
      if (todayDay) {
        rpcTodayViewsFromDays = Number(todayDay.views || 0);
      }
    }
  }

  const totalViews = (postsForViewsRes.data || []).reduce((sum: number, p: any) => sum + (p.views || 0), 0);
  const todayKeyUtc = nowUtc.toISOString().slice(0, 10);
  const todayViewsFromMap = viewsDataMap.get(todayKeyUtc) || 0;
  const todayViews = todayViewsRes.count ?? rpcTodayViewsFromDays ?? rpcTodayViews ?? todayViewsFromMap;
  const resolvedViewsData = viewsData;

  const topCategoryMap = new Map<string, number>();
  for (const row of publishedCategoriesRes.data || []) {
    const slug = generateSlug((row.category || 'uncategorized').toString());
    topCategoryMap.set(slug, (topCategoryMap.get(slug) || 0) + 1);
  }

  const topCategories = Array.from(topCategoryMap.entries())
    .map(([slug, count]) => ({ slug, name: titleCase(slug), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const countryMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  const countryPostMap = new Map<string, Map<string, { postId: string; title: string; slug: string; views: number }>>();

  for (const row of geoViewEventsRes.data || []) {
    const country = (row.country_name || 'Unknown').toString().trim() || 'Unknown';
    countryMap.set(country, (countryMap.get(country) || 0) + 1);

    const source = (row.source_domain || 'Direct / Unknown').toString().trim() || 'Direct / Unknown';
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);

    const postId = row.post_id as string;
    const postRel = Array.isArray(row.post) ? row.post[0] : row.post;
    const postTitle = postRel?.title || 'Untitled post';
    const postSlug = postRel?.slug || '';

    if (!countryPostMap.has(country)) {
      countryPostMap.set(country, new Map());
    }

    const postsInCountry = countryPostMap.get(country)!;
    const existingPost = postsInCountry.get(postId);
    if (existingPost) {
      existingPost.views += 1;
    } else {
      postsInCountry.set(postId, {
        postId,
        title: postTitle,
        slug: postSlug,
        views: 1,
      });
    }
  }

  const topCountries = Array.from(countryMap.entries())
    .map(([country, views]) => ({ country, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const topSources = Array.from(sourceMap.entries())
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const topPostsByCountry = topCountries.slice(0, 5).map(({ country }) => {
    const posts = Array.from(countryPostMap.get(country)?.values() || [])
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
    return { country, posts };
  });

  return {
    totalPosts: totalPostsRes.count || 0,
    publishedPosts: publishedPostsRes.count || 0,
    draftPosts: draftPostsRes.count || 0,
    totalComments: totalCommentsRes.count || 0,
    totalViews,
    todayViews,
    viewsData: resolvedViewsData,
    topCountries,
    topSources,
    topPostsByCountry,
    recentPosts: (recentPostsRes.data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: titleCase(generateSlug((p.category || 'news').toString())),
      views: p.views || 0,
      status: p.status || 'draft',
      created_at: p.created_at,
    })),
    topCategories,
  };
}

export async function getPostAnalytics(postId: string) {
  if (!postId || postId.trim() === '') {
    throw new Error('Invalid post ID');
  }

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, title, slug, views, published_at')
    .eq('id', postId)
    .single();

  if (postError) {
    console.error('Post query error:', postError);
    throw new Error(`Failed to fetch post: ${postError.message}`);
  }

  if (!post) {
    console.error('Post not found for ID:', postId);
    throw new Error('Post not found');
  }

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  const [viewEventsRes, geoViewEventsRes] = await Promise.all([
    supabase
      .from('post_views')
      .select('viewed_at')
      .eq('post_id', postId)
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: true }),
    supabase
      .from('post_views')
      .select('viewed_at, country_name, source_domain')
      .eq('post_id', postId)
      .order('viewed_at', { ascending: false })
      .limit(500),
  ]);

  const viewsDataMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    viewsDataMap.set(d.toISOString().slice(0, 10), 0);
  }

  if (!viewEventsRes.error && viewEventsRes.data) {
    for (const row of viewEventsRes.data) {
      const key = new Date(row.viewed_at).toISOString().slice(0, 10);
      if (viewsDataMap.has(key)) {
        viewsDataMap.set(key, (viewsDataMap.get(key) || 0) + 1);
      }
    }
  }

  const viewsData = Array.from(viewsDataMap.entries()).map(([isoDay]) => {
    const d = new Date(`${isoDay}T00:00:00`);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: viewsDataMap.get(isoDay) || 0,
    };
  });

  const countryMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  const recentVisits: { timestamp: string; country: string; source: string }[] = [];

  for (const row of geoViewEventsRes.data || []) {
    const country = (row.country_name || 'Unknown').toString().trim() || 'Unknown';
    countryMap.set(country, (countryMap.get(country) || 0) + 1);

    const source = (row.source_domain || 'Direct / Unknown').toString().trim() || 'Direct / Unknown';
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);

    recentVisits.push({
      timestamp: new Date(row.viewed_at).toLocaleString(),
      country,
      source,
    });
  }

  const countriesData = Array.from(countryMap.entries())
    .map(([country, views]) => ({ country, views }))
    .sort((a, b) => b.views - a.views);

  const sourcesData = Array.from(sourceMap.entries())
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views);

  return {
    postId: post.id,
    postTitle: post.title,
    postSlug: post.slug,
    totalViews: post.views || 0,
    publishedAt: post.published_at,
    viewsData,
    countriesData,
    sourcesData,
    recentVisits: recentVisits.slice(0, 50),
  };
}

export async function getAllComments(filters?: { approved?: boolean }) {
  let query = supabase.from('comments').select('*, post:post_id (title)').order('created_at', { ascending: false });
  if (filters?.approved !== undefined) {
    query = query.eq('approved', filters.approved);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((comment: any) => ({
    ...comment,
    name: comment.name || comment.author_name || 'Reader',
  }));
}

export async function approveComment(commentId: string, approved: boolean) {
  const { error } = await supabase.from('comments').update({ approved }).eq('id', commentId);
  if (error) throw error;
  return true;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
  return true;
}

export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data || []).map(normalizePost);
}

// User Bookmarks (Reading List)
export async function toggleBookmark(postId: string, userId: string) {
  // Check if bookmark exists
  const { data: existing, error: checkError } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
    
  if (checkError) throw checkError;

  if (existing) {
    // Remove it
    const { error: deleteError } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id);
    if (deleteError) throw deleteError;
    return { bookmarked: false };
  } else {
    // Add it
    const { error: insertError } = await supabase
      .from('bookmarks')
      .insert([{ post_id: postId, user_id: userId }]);
    if (insertError) throw insertError;
    return { bookmarked: true };
  }
}

export async function getBookmarks(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      post:post_id (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  // Map it to look like normal posts for the UI
  return (data || []).map((d: any) => ({ ...normalizePost(d.post || {}), bookmark_id: d.id }));
}

export async function checkIsBookmarked(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) return false;
  return !!data;
}

// Notifications
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
    
  if (error) throw error;
  return true;
}

// ---------------------------------------------------------
// NEWSLETTER SUBSCRIPTION API
// ---------------------------------------------------------

/**
 * Subscribes an email to the newsletter.
 */
export async function subscribeToNewsletter(email: string) {
  // If the user hasn't run the SQL query yet, this will fail gracefully
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ email }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Email is already subscribed');
    }
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
  
  return data;
}

/**
 * Checks if an email is already subscribed.
 */
export async function checkSubscription(email: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore row not found error
    console.error('Error checking subscription:', error);
    throw error;
  }

  return !!data;
}

/**
 * Unsubscribes an email from the newsletter.
 */
export async function unsubscribeFromNewsletter(email: string) {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('email', email);

  if (error) {
    console.error('Error unsubscribing from newsletter:', error);
    throw error;
  }
  
  return true;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Returns newsletter subscribers for admin usage.
 */
export async function getNewsletterSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    throw error;
  }

  return (data ?? []) as NewsletterSubscription[];
}
