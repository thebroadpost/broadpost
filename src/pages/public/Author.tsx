import { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getPosts } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { LazyRender } from '../../components/ui/LazyRender';

const PostGrid = lazy(() =>
  import('../../components/blog/PostGrid').then((module) => ({ default: module.PostGrid }))
);
const Sidebar = lazy(() =>
  import('../../components/layout/Sidebar').then((module) => ({ default: module.Sidebar }))
);

export default function Author() {
  const { authorName: rawAuthorName } = useParams<{ authorName: string }>();

  const authorName = rawAuthorName ? decodeURIComponent(rawAuthorName) : '';

  const { data: posts, isLoading } = useQuery({
    queryKey: ['author-posts', authorName],
    queryFn: () => getPosts({ status: 'published', author_name: authorName }, { page: 1, limit: 1 }),
    enabled: !!authorName,
  });

  const displayName = authorName || 'Author';
  const authorDescription = `Read the latest stories written by ${displayName} on BROADPOST.`;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="w-full h-[300px]" />
        <div className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Skeleton className="lg:col-span-8 h-[600px]" />
          <Skeleton className="lg:col-span-4 h-[600px]" />
        </div>
      </div>
    );
  }

  if (!authorName) {
    return (
      <div className="py-20 text-center font-sans">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Author not found</h2>
        <p className="text-gray-500">The author profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{displayName} | BROADPOST</title>
        <meta name="description" content={authorDescription} />
      </Helmet>

      <section className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-primary dark:to-gray-900 text-primary dark:text-white py-16 md:py-20 px-4 lg:px-8 block w-full border-b border-gray-300 dark:border-gray-800">
        <div className="max-w-[1600px] mx-auto">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-gray-600 dark:text-gray-300 mb-4">Author archive</p>
          <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6">{displayName}</h1>
          <p className="font-sans text-base md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">
            {authorDescription}
          </p>
          <p className="font-sans text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-4">
            {posts && typeof posts.count === 'number' ? `${posts.count} articles found` : 'Loading articles...'}
          </p>
        </div>
      </section>

      <LazyRender
        fallback={
          <section className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <Skeleton className="lg:w-[70%] h-[650px]" />
              <Skeleton className="lg:w-[30%] h-[450px]" />
            </div>
          </section>
        }
      >
        <section className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-[70%]">
              <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
                <PostGrid authorName={authorName} />
              </Suspense>
            </div>

            <div className="lg:w-[30%]">
              <Suspense fallback={<Skeleton className="w-full h-[450px]" />}>
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </section>
      </LazyRender>
    </>
  );
}
