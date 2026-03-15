import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getPosts } from '../../lib/api';
import { PostCard } from './PostCard';
import { Skeleton } from '../ui/Skeleton';

interface PostGridProps {
  categorySlug?: string;
}

export function PostGrid({ categorySlug }: PostGridProps) {
  const limit = 7;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts-infinite', { status: 'published', category_slug: categorySlug, limit }],
    queryFn: ({ pageParam = 1 }) =>
      getPosts(
        { status: 'published', category_slug: categorySlug },
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

  // Group posts after the hero into pairs for the 2-column grid
  const standardRows = useMemo(() => {
    const rest = allPosts.slice(1);
    const rows: (typeof rest)[] = [];
    for (let i = 0; i < rest.length; i += 2) {
      rows.push(rest.slice(i, i + 2));
    }
    return rows;
  }, [allPosts]);

  const totalVirtualItems = allPosts.length > 0 ? 1 + standardRows.length : 0;

  // Virtualizer scrolls with the window (not a fixed-height container)
  const rowVirtualizer = useVirtualizer({
    count: totalVirtualItems,
    getScrollElement: () => document.documentElement,
    estimateSize: (index) => (index === 0 ? 300 : 420),
    overscan: 3,
  });

  // Sentinel-based infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    return (
      <div className="text-red-500 py-8 text-center font-sans">
        Error loading posts. Please try again later.
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center font-sans tracking-wide">
        No posts found in this category.
      </div>
    );
  }

  return (
    <div>
      {/* Virtualized rows */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {virtualRow.index === 0 ? (
              allPosts[0] && <PostCard post={allPosts[0]} variant="horizontal" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 pt-12">
                {standardRows[virtualRow.index - 1]?.map(post => (
                  <PostCard key={post.id} post={post} variant="standard" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      {isFetchingNextPage && (
        <div className="mt-8 space-y-4">
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
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
