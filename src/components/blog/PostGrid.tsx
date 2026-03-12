import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../lib/api';
import { PostCard } from './PostCard';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';

interface PostGridProps {
  categoryId?: string;
}

export function PostGrid({ categoryId }: PostGridProps) {
  const [page, setPage] = React.useState(1);
  const limit = 7; // 1 large + 6 normal cards
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', { status: 'published', category_id: categoryId, page, limit }],
    queryFn: () => getPosts({ status: 'published', category_id: categoryId }, { page, limit }),
    // In a real app we would use useInfiniteQuery for "Load More"
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="w-full h-[250px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="space-y-3">
               <Skeleton className="w-full aspect-[16/10]" />
               <Skeleton className="w-20 h-4" />
               <Skeleton className="w-full h-6" />
               <Skeleton className="w-2/3 h-6" />
             </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return <div className="text-red-500 py-8 text-center font-sans">Error loading posts. Please try again later.</div>;
  }

  const posts = data.data;

  if (posts.length === 0) {
    return <div className="text-gray-500 py-8 text-center font-sans tracking-wide">No posts found in this category.</div>;
  }

  const firstPost = posts[0];
  const restPosts = posts.slice(1);

  return (
    <div>
      {/* First large post */}
      {firstPost && (
        <PostCard post={firstPost} variant="horizontal" />
      )}

      {/* Grid for remaining posts */}
      {restPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {restPosts.map(post => (
            <PostCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      )}

      {data.count && data.count > page * limit && (
        <div className="mt-12 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full max-w-xs font-bold tracking-widest uppercase border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
            onClick={() => setPage(p => p + 1)}
          >
            Load More Stories
          </Button>
        </div>
      )}
    </div>
  );
}
