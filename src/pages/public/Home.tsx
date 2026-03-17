import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getCategories, getHomepageHeroPosts, getPosts } from '../../lib/api';
import { PostCard } from '../../components/blog/PostCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { LazyRender } from '../../components/ui/LazyRender';

const PostGrid = lazy(() =>
  import('../../components/blog/PostGrid').then((module) => ({ default: module.PostGrid }))
);
const Sidebar = lazy(() =>
  import('../../components/layout/Sidebar').then((module) => ({ default: module.Sidebar }))
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [heroStartIndex, setHeroStartIndex] = useState(0);
  const handleTabChange = useCallback((slug: string) => setActiveTab(slug), []);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categoryTabs = [
    { name: 'All', slug: 'all' },
    ...((categories || []).map((category) => ({
      name: category.name,
      slug: category.slug,
    }))),
  ];

  // Featured Posts for Hero Grid (Top 4)
  const { data: topStories, isLoading: heroLoading } = useQuery({
    queryKey: ['homepageHeroPosts'],
    queryFn: getHomepageHeroPosts,
  });

  // Editors strip posts
  const { data: editorsStrip, isLoading: editorsLoading } = useQuery({
    queryKey: ['editorsStripPosts'],
    queryFn: () => getPosts({ status: 'published' }, { limit: 4, page: 2 }) // Mocking by fetching page 2
  });

  // Opinion Section Posts
  const { data: opinionPosts, isLoading: opinionLoading } = useQuery({
    queryKey: ['opinionPosts', 'home'],
    queryFn: async () => {
      const res = await getPosts({ status: 'published', category_slug: 'opinion' }, { limit: 3, page: 1 });
      return res;
    }
  });

  const rotatedTopStories = useMemo(() => {
    if (!topStories || topStories.length <= 1) return topStories || [];
    return [
      ...topStories.slice(heroStartIndex),
      ...topStories.slice(0, heroStartIndex),
    ];
  }, [topStories, heroStartIndex]);

  useEffect(() => {
    setHeroStartIndex(0);
  }, [topStories?.length]);

  useEffect(() => {
    if (!topStories || topStories.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setHeroStartIndex((current) => (current + 1) % topStories.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [topStories]);

  return (
    <>
      <Helmet>
        <title>BROADPOST | Insight. Analysis. Opinion.</title>
        <meta name="description" content="The premier digital destination for deep analysis, breaking business news, and unparalleled editorial insight." />
      </Helmet>

      {/* SECTION 1 — Hero Grid */}
      <section className="px-4 lg:px-6 py-5 mb-6 max-w-[1480px] mx-auto">
        {heroLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[540px]">
            <Skeleton className="lg:col-span-8 h-full" />
            <div className="lg:col-span-4 flex flex-col space-y-6">
               <Skeleton className="h-1/3 w-full" />
               <Skeleton className="h-1/3 w-full" />
               <Skeleton className="h-1/3 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 lg:h-[540px] lg:max-h-[66vh]">
            {/* Left - Featured Large */}
            <div className="lg:w-[60%] h-[360px] lg:h-full flex-shrink-0">
               {rotatedTopStories[0] && <PostCard post={rotatedTopStories[0]} variant="featured" />}
            </div>

            {/* Right - 3 Stacked */}
            <div className="lg:w-[40%] flex flex-col justify-between divide-y divide-gray-200">
               {rotatedTopStories.slice(1, 4).map(post => (
                 <div key={post.id} className="flex-1 flex flex-col justify-center py-4 first:pt-0 last:pb-0">
                   <PostCard post={post} variant="small" />
                 </div>
               ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 — Category Tabs Bar */}
      <section className="sticky top-[104px] z-40 bg-white dark:bg-gray-900 border-y border-border dark:border-gray-800 px-4 lg:px-6 shadow-sm transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto flex overflow-x-auto no-scrollbar py-2.5 space-x-2">
          {categoryTabs.map(tab => (
            <button
              key={tab.slug}
              onClick={() => handleTabChange(tab.slug)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wide transition-colors shrink-0 ${
                activeTab === tab.slug 
                  ? 'bg-primary dark:bg-gray-100 text-white dark:text-gray-900 border border-primary dark:border-gray-100' 
                  : 'bg-white dark:bg-gray-900 text-primary dark:text-gray-300 border border-border dark:border-gray-700 hover:border-primary dark:hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Main Content + Sidebar */}
      <LazyRender
        fallback={
          <section className="px-4 lg:px-6 py-12 max-w-[1480px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-[70%] space-y-8">
                <Skeleton className="w-full h-[250px]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full h-52" />
                  ))}
                </div>
              </div>
              <div className="lg:w-[30%] space-y-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <section className="px-4 lg:px-6 py-12 max-w-[1480px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Grid */}
            <div className="lg:w-[70%]">
              <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
                <PostGrid categorySlug={activeTab !== 'all' ? activeTab : undefined} />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="lg:w-[30%]">
              <Suspense fallback={<Skeleton className="w-full h-[450px]" />}>
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </section>
      </LazyRender>

      {/* SECTION 4 — SECOND FEATURED STRIP */}
      <LazyRender
        fallback={
          <section className="bg-gray-100 dark:bg-gray-800/40 py-12 px-4 lg:px-6 transition-colors duration-200">
            <div className="max-w-[1480px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </section>
        }
      >
        <section className="bg-gray-100 dark:bg-gray-800/40 py-12 px-4 lg:px-6 transition-colors duration-200">
          <div className="max-w-[1480px] mx-auto">
            <div className="flex items-center justify-between mb-6 border-b-2 border-primary dark:border-gray-700 pb-2">
              <h2 className="font-sans font-bold text-lg uppercase tracking-widest text-primary dark:text-white">From The Editors</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {editorsLoading ? (
                [1,2,3,4].map(i => <Skeleton key={i} className="h-48" />)
              ) : editorsStrip?.data && (
                editorsStrip.data.map(post => (
                  <PostCard key={post.id} post={post} variant="minimal" />
                ))
              )}
            </div>
          </div>
        </section>
      </LazyRender>

      {/* SECTION 5 — OPINION SECTION */}
      <LazyRender
        fallback={
          <section className="px-4 lg:px-6 py-14 max-w-[1480px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </section>
        }
      >
        <section className="px-4 lg:px-6 py-14 max-w-[1480px] mx-auto">
          <div className="flex items-center justify-between mb-8 border-b-2 border-primary dark:border-gray-700 pb-2">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary dark:text-white">Opinion & Analysis</h2>
            <Link to="/category/opinion" className="font-sans font-bold text-sm uppercase tracking-widest text-accent-blue hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opinionLoading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-64" />)
            ) : opinionPosts?.data && (
              opinionPosts.data.map(post => (
                <PostCard key={post.id} post={post} variant="opinion" />
              ))
            )}
          </div>
        </section>
      </LazyRender>

    </>
  );
}
