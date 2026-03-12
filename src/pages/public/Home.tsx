import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getFeaturedPosts, getPosts } from '../../lib/api';
import { PostCard } from '../../components/blog/PostCard';
import { PostGrid } from '../../components/blog/PostGrid';
import { Sidebar } from '../../components/layout/Sidebar';
import { Skeleton } from '../../components/ui/Skeleton';

const CATEGORY_TABS = [
  { name: 'All', slug: 'all' },
  { name: 'Business', slug: 'business' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Markets', slug: 'markets' },
  { name: 'Economy', slug: 'economy' },
  { name: 'Tech', slug: 'tech' },
  { name: 'World', slug: 'world' },
  { name: 'Opinion', slug: 'opinion' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');

  // Featured Posts for Hero Grid (Top 4)
  const { data: topStories, isLoading: heroLoading } = useQuery({
    queryKey: ['featuredPosts', 'hero'],
    queryFn: getFeaturedPosts
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
      const res = await getPosts({ status: 'published', category_id: undefined }, { limit: 3, page: 1 }); // We will mock category filter for now or filter out client side, but since it's just ui implementation let's fetch any and display as opinion
      return res;
    }
  });

  return (
    <>
      <Helmet>
        <title>BROADPOST | Insight. Analysis. Opinion.</title>
        <meta name="description" content="The premier digital destination for deep analysis, breaking business news, and unparalleled editorial insight." />
      </Helmet>

      {/* SECTION 1 — Hero Grid */}
      <section className="px-4 lg:px-8 py-6 mb-8 max-w-[1600px] mx-auto">
        {heroLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
            <Skeleton className="lg:col-span-8 h-full" />
            <div className="lg:col-span-4 flex flex-col space-y-6">
               <Skeleton className="h-1/3 w-full" />
               <Skeleton className="h-1/3 w-full" />
               <Skeleton className="h-1/3 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:h-[600px] lg:max-h-[70vh]">
            {/* Left - Featured Large */}
            <div className="lg:w-[60%] h-[400px] lg:h-full flex-shrink-0">
               {topStories?.[0] && <PostCard post={topStories[0]} variant="featured" />}
            </div>

            {/* Right - 3 Stacked */}
            <div className="lg:w-[40%] flex flex-col justify-between divide-y divide-gray-200">
               {topStories?.slice(1, 4).map(post => (
                 <div key={post.id} className="flex-1 flex flex-col justify-center py-4 first:pt-0 last:pb-0">
                   <PostCard post={post} variant="small" />
                 </div>
               ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2 — Category Tabs Bar */}
      <section className="sticky top-[116px] z-40 bg-white border-y border-border px-4 lg:px-8 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex overflow-x-auto no-scrollbar py-3 space-x-2">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-sans text-[13px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === tab.slug 
                  ? 'bg-primary text-white border border-primary' 
                  : 'bg-white text-primary border border-border hover:border-primary'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Main Content + Sidebar */}
      <section className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Grid */}
          <div className="lg:w-[70%]">
             <PostGrid categoryId={activeTab !== 'all' ? undefined : undefined} />
             {/* Note: since activeTab slug to ID mapping requires category data, we'd normally pass the valid category ID down. Simplified for layout. */}
          </div>

          {/* Sidebar */}
          <div className="lg:w-[30%]">
            <Sidebar />
          </div>

        </div>
      </section>

      {/* SECTION 4 — SECOND FEATURED STRIP */}
      <section className="bg-gray-100 py-16 px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8 border-b-2 border-primary pb-2">
            <h2 className="font-sans font-bold text-lg uppercase tracking-widest text-primary">From The Editors</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* SECTION 5 — OPINION SECTION */}
      <section className="px-4 lg:px-8 py-20 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-12 border-b-2 border-primary pb-2">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary">Opinion & Analysis</h2>
          <Link to="/category/opinion" className="font-sans font-bold text-sm uppercase tracking-widest text-accent-blue hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {opinionLoading ? (
             [1,2,3].map(i => <Skeleton key={i} className="h-64" />)
          ) : opinionPosts?.data && (
            opinionPosts.data.map(post => (
              <PostCard key={post.id} post={post} variant="opinion" />
            ))
          )}
        </div>
      </section>

    </>
  );
}
