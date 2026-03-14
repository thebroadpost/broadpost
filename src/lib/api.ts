import { supabase } from './supabase';
import { PaginationParams } from '../types';
import { generateSlug } from './utils';

function titleCase(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePost(raw: any): any {
  const rawCategory = (raw?.category || '').toString().trim();
  const categorySlug = rawCategory ? generateSlug(rawCategory) : 'news';

  return {
    ...raw,
    category_id: raw?.category_id || categorySlug,
    author_id: raw?.author_id || '',
    published_at: raw?.published_at || raw?.created_at || null,
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
  const slug = generateSlug(categorySlug);
  const spaced = slug.replace(/-/g, ' ');
  return Array.from(new Set([slug, spaced, titleCase(slug)]));
}

const POST_SELECT = '*';

export async function getPosts(filters?: { status?: string, category_slug?: string }, pagination?: PaginationParams) {
  let query = supabase.from('posts').select(POST_SELECT, { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.category_slug) {
    query = query.in('category', categoryVariants(filters.category_slug));
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
  const rpcResult = await supabase.rpc('record_post_view', { p_post_id: postId });
  if (!rpcResult.error) return;

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

  const payload: Record<string, any> = {
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    excerpt: postData.excerpt,
    cover_image: postData.cover_image,
    category: postData.category,
    tags: postData.tags || [],
    status: postData.status,
    author_name: postData.author_name || userData.user.user_metadata?.full_name || 'Staff',
    author_avatar: postData.author_avatar || userData.user.user_metadata?.avatar_url || null,
    author_bio: postData.author_bio || null,
    views: postData.views || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: userData.user.id,
    category_id: postData.category_id,
    published_at: postData.published_at,
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
  const payload: Record<string, any> = {
    ...postData,
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

export async function getAdminStats() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const [
    totalPostsRes,
    publishedPostsRes,
    draftPostsRes,
    totalCommentsRes,
    postsForViewsRes,
    viewEventsRes,
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
      .select('viewed_at')
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: true }),
    supabase
      .from('posts')
      .select('id,title,slug,category,views,status,created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('posts').select('category').eq('status', 'published'),
  ]);

  const viewsDataMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
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

  const viewsData = Array.from(viewsDataMap.entries()).map(([isoDay, views]) => {
    const d = new Date(`${isoDay}T00:00:00`);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      views,
    };
  });

  const totalViews = (postsForViewsRes.data || []).reduce((sum: number, p: any) => sum + (p.views || 0), 0);

  const topCategoryMap = new Map<string, number>();
  for (const row of publishedCategoriesRes.data || []) {
    const slug = generateSlug((row.category || 'uncategorized').toString());
    topCategoryMap.set(slug, (topCategoryMap.get(slug) || 0) + 1);
  }

  const topCategories = Array.from(topCategoryMap.entries())
    .map(([slug, count]) => ({ slug, name: titleCase(slug), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    totalPosts: totalPostsRes.count || 0,
    publishedPosts: publishedPostsRes.count || 0,
    draftPosts: draftPostsRes.count || 0,
    totalComments: totalCommentsRes.count || 0,
    totalViews,
    viewsData,
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
