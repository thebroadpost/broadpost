import React from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { PostGrid } from '../../components/blog/PostGrid';
import { Hash } from 'lucide-react';

export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category';
  
  const { data: posts, isLoading } = usePosts({ category: categoryName });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="mb-12 border-b border-[#E6E6E6] pb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-6 text-gray-400">
          <Hash className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-black mb-4">
          {categoryName}
        </h1>
        <p className="text-xl text-gray-500">
          Discover stories and insights about {categoryName.toLowerCase()}.
          {posts && <span className="block mt-2 text-sm">Showing {posts.length} posts</span>}
        </p>
      </div>

      <PostGrid posts={posts || []} isLoading={isLoading} />
    </div>
  );
}
