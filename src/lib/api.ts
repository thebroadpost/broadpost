import { supabase } from './supabase';
import { PaginationParams } from '../types';

export async function getPosts(filters?: { status?: string, category_id?: string }, pagination?: PaginationParams) {
  let query = supabase.from('posts').select(`
    *,
    author:author_id (id, full_name, avatar_url, email),
    category:category_id (id, name, slug)
  `, { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  query = query.order('created_at', { ascending: false });

  if (pagination) {
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data as any[], count };
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id (id, full_name, avatar_url, email),
      category:category_id (id, name, slug)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getPostsByCategory(categorySlug: string) {
  // First get category id
  const { data: categoryData, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (catError) throw catError;

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id (id, full_name, avatar_url, email),
      category:category_id (id, name, slug)
    `)
    .eq('category_id', categoryData.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFeaturedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id (id, full_name, avatar_url, email),
      category:category_id (id, name, slug)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;
  return data;
}

export async function getTrendingPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id (id, full_name, avatar_url, email),
      category:category_id (id, name, slug)
    `)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

export async function incrementViews(postId: string) {
  // Using an rpc call or naive update
  // Supabase naive update might face race conditions, but for a simple blog it's acceptable.
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
  return data;
}

export async function addComment(commentData: { post_id: string, name: string, content: string }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { ...commentData, approved: true } // Auto approve for now, or false based on requirements
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

// ADMIN FUNCTIONS
export async function createPost(postData: any) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('posts')
    .insert([
      { ...postData, author_id: userData.user.id }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(postId: string, postData: any) {
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  const published_at = isPublished ? new Date().toISOString() : null;
  
  const { data, error } = await supabase
    .from('posts')
    .update({ status, published_at })
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAdminStats() {
  const { count: totalPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: publishedPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
  const { count: draftPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft');
  const { count: totalComments } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  
  // Dummy views data for last 7 days
  const viewsData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      views: Math.floor(Math.random() * 1000) + 100
    };
  }).reverse();

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    draftPosts: draftPosts || 0,
    totalComments: totalComments || 0,
    viewsData
  };
}

export async function getAllComments(filters?: { approved?: boolean }) {
  let query = supabase.from('comments').select('*, post:post_id (title)').order('created_at', { ascending: false });
  if (filters?.approved !== undefined) {
    query = query.eq('approved', filters.approved);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
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
    .select(`
      *,
      author:author_id (id, full_name, avatar_url, email),
      category:category_id (id, name, slug)
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}
