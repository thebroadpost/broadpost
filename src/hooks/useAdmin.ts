import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';

// Fetch all posts including drafts for admin
export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });
}

// Fetch all comments for moderation
export function useAllComments() {
  return useQuery({
    queryKey: ['admin_comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, posts(title, slug)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Dashboard Stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const [postsCount, commentsCount, postsData] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('views, status')
      ]);

      const totalViews = postsData.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const draftPosts = postsData.data?.filter(p => p.status === 'draft').length || 0;

      return {
        totalPosts: postsCount.count || 0,
        totalComments: commentsCount.count || 0,
        totalViews,
        draftPosts
      };
    },
  });
}

// Post Mutations
export function useSavePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      if (post.id) {
        // Update
        const { data, error } = await supabase.from('posts').update({ ...post, updated_at: new Date().toISOString() }).eq('id', post.id).select().single();
        if (error) throw error;
        return data;
      } else {
        // Insert
        const { data, error } = await supabase.from('posts').insert([post]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });
}

// Comment Mutations
export function useModerateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, action }: { id: string, action: 'approve' | 'delete' }) => {
      if (action === 'delete') {
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('comments').update({ approved: true }).eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
