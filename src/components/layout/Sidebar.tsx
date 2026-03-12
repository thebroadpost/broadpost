import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingPosts, getFeaturedPosts, getCategories } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';
import { PostCard } from '../blog/PostCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingPosts
  });

  const { data: editorsPicks, isLoading: editorsPicksLoading } = useQuery({
    queryKey: ['editorsPicks'],
    queryFn: getFeaturedPosts
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  return (
    <aside className="space-y-12 sticky top-24">
      
      {/* Trending Now */}
      <div>
        <div className="bg-primary text-white px-4 py-2 mb-6">
          <h3 className="font-sans font-bold uppercase tracking-widest text-sm">Trending Now</h3>
        </div>
        
        {trendingLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="flex flex-col space-y-0">
            {trending?.map((post, index) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group flex items-start py-4 border-b border-gray-100 cursor-pointer">
                <span className="font-serif font-bold text-3xl text-gray-200 mr-4 w-8">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="font-sans font-bold text-[15px] leading-tight text-primary group-hover:text-accent-blue transition-colors mb-1">
                    {post.title}
                  </h4>
                  <span className="text-accent-blue font-bold text-[10px] uppercase tracking-wider block">
                    {post.category?.name || 'News'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Editor's Picks */}
      <div>
        <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
          <h3 className="font-serif font-bold text-xl text-primary">Editor's Picks</h3>
        </div>
        
        {editorsPicksLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {editorsPicks?.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} variant="small" />
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-primary text-white p-8">
        <h3 className="font-serif font-bold text-2xl mb-4 leading-tight">Get BROADPOST in your inbox</h3>
        <p className="font-sans text-sm text-gray-300 mb-6">Sign up for our daily newsletter and get the most important stories curated by our editors.</p>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Input 
            type="email" 
            placeholder="Email address" 
            required
            className="border-none"
          />
          <Button type="submit" fullWidth className="font-bold tracking-widest uppercase bg-accent-blue hover:bg-blue-800 text-white border-none">
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed tracking-wide">
          By signing up, you accept and agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Popular Categories */}
      {categories && categories.length > 0 && (
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
            <h3 className="font-serif font-bold text-xl text-primary">Popular Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`}
                className="px-4 py-2 border border-border rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}
