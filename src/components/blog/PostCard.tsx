import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDate, calculateReadTime } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const readTime = post.content ? calculateReadTime(post.content) : 1;
  const imageDisplay = post.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

  if (featured) {
    return (
      <article className="group relative flex flex-col md:flex-row gap-8 items-center bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden">
          <img
            src={imageDisplay}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          {post.category && (
            <Badge variant="success" className="w-fit mb-4">
              {post.category.toUpperCase()}
            </Badge>
          )}
          <Link to={`/blog/${post.slug}`} className="block">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black mb-4 group-hover:underline">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 text-lg mb-8 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center mt-auto">
            {post.author_avatar && (
              <img src={post.author_avatar} alt={post.author_name || 'Author'} className="w-10 h-10 rounded-full mr-3 object-cover" />
            )}
            <div>
              <p className="text-sm font-bold text-black">{post.author_name || 'Anonymous'}</p>
              <div className="flex items-center text-xs text-gray-500">
                <span>{formatDate(post.created_at)}</span>
                <span className="mx-1">&middot;</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col gap-4">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]">
        <img
          src={imageDisplay}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div>
        {post.category && (
          <span className="text-xs font-bold tracking-widest text-[#1A8917] uppercase mb-2 block">
            {post.category}
          </span>
        )}
        <Link to={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-bold leading-snug text-black mb-2 group-hover:underline line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center">
          <div>
            <p className="text-sm font-semibold text-black">{post.author_name || 'Anonymous'}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatDate(post.created_at)}</span>
              <span className="mx-1">&middot;</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
