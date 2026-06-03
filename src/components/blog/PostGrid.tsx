import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../../lib/api';
import { PostCard } from './PostCard';
import { Skeleton } from '../ui/Skeleton';
import { AdsterraAd } from '../ui/AdsterraAd';
import { Button } from '../ui/Button';

interface PostGridProps {
  categorySlug?: string;
  authorName?: string;
}

export function PostGrid({ categorySlug, authorName }: PostGridProps) {
  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts-infinite', { status: 'published', category_slug: categorySlug, author_name: authorName, limit }],
    queryFn: ({ pageParam = 1 }) =>
      getPosts(
        { status: 'published', category_slug: categorySlug, author_name: authorName },
        { page: pageParam as number, limit }
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap(p => p.data).length;
      if (lastPage.count && totalLoaded < lastPage.count) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  // Flatten pages -> single post array
  const allPosts = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data]
  );

  const standardPosts = useMemo(() => allPosts.slice(1), [allPosts]);

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

  if (isError) {
    return (
      <div className="text-red-500 py-8 text-center font-sans">
        Error loading posts. Please try again later.
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center font-sans tracking-wide">
        No posts found.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        {allPosts[0] && <PostCard post={allPosts[0]} variant="horizontal" />}
        <div className="px-4 sm:px-0">
            <AdsterraAd placement="rectangle" mobilePlacement="mobileBanner" />
        </div>
      </div>

      {standardPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 pt-12">
          {standardPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-8 space-y-4">
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </div>
      )}
      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="font-bold tracking-wide uppercase"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Blogs'}
          </Button>
        </div>
      )}
      {!hasNextPage && allPosts.length > limit && (
        <p className="text-center text-sm text-gray-500 font-sans mt-8 py-4">
          You've reached the end — all stories loaded.
        </p>
      )}
    </div>
  );
}
