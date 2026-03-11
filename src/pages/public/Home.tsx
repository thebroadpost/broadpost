import React from 'react';
import { usePosts, useTrendingPosts } from '../../hooks/usePosts';
import { PostGrid } from '../../components/blog/PostGrid';
import { PostCard } from '../../components/blog/PostCard';
import { Sidebar } from '../../components/layout/Sidebar';

export function Home() {
  const { data: posts, isLoading } = usePosts({ limit: 10 });
  
  const featuredPost = posts?.[0];
  const gridPosts = posts?.slice(1) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Section */}
      <section className="text-center md:text-left py-12 md:py-24 border-b border-[#E6E6E6] mb-12">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-6 leading-none">
          Stay curious.
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <div className="lg:w-2/3 space-y-12">
          
          {/* Featured Post */}
          {isLoading ? (
            <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          ) : featuredPost ? (
            <section className="mb-16">
              <PostCard post={featuredPost} featured />
            </section>
          ) : null}

          {/* Post Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black border-b border-gray-100 pb-2">Latest Posts</h2>
            <PostGrid posts={gridPosts} isLoading={isLoading} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
