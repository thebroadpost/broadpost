import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

export function usePosts(options?: { category?: string; limit?: number; status?: 'published' | 'draft' }) {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.category) {
        query = query.ilike('category', options.category);
      }
      
      if (options?.status) {
        query = query.eq('status', options.status);
      } else {
        // default to published for public consumption if no status provided
        query = query.eq('status', 'published');
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Post[];
    },
  });
}

export function useTrendingPosts() {
  return useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Post[];
    },
  });
}
