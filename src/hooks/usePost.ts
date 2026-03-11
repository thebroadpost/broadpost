import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Post;
    },
    enabled: !!slug,
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!postId,
  });
}

export function useIncrementViews() {
  return useMutation({
    mutationFn: async (slug: string) => {
      // Supabase RPC or just simple fetch then increment.
      // Easiest without RPC is fetching current then updating (not atomic but okay for demo)
      // Since we want simple, let's use a serverless Edge function usually, but here we can do:
      const { data: post } = await supabase.from('posts').select('views, id').eq('slug', slug).single();
      if (post) {
        await supabase.from('posts').update({ views: post.views + 1 }).eq('id', post.id);
      }
    }
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newComment: { post_id: string; author_name: string; content: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ ...newComment, approved: true }]) // Auto-approving for demo simplicity if they desire strict, we set to false. Let's make it auto-appoved so it shows up immediately to the user reading
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
    },
  });
}
