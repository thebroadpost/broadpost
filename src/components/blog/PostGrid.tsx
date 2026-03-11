import React from 'react';
import { Post } from '../../types';
import { PostCard } from './PostCard';
import { Skeleton } from '../ui/Skeleton';

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
}

export function PostGrid({ posts, isLoading }: PostGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="w-full aspect-[4/3] rounded-xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <div className="flex items-center mt-2 gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-[#E6E6E6] rounded-2xl">
        <h3 className="text-xl font-bold text-black mb-2">No posts found</h3>
        <p className="text-gray-500">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
