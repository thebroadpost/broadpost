import React from 'react';
import { Post } from '../../types';
import { formatDate, calculateReadTime } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  const readTime = post.content ? calculateReadTime(post.content) : 1;

  return (
    <header className="mb-12 text-center max-w-3xl mx-auto px-4 mt-8 md:mt-16">
      {post.category && (
        <Link to={`/category/${post.category.toLowerCase()}`}>
          <Badge variant="success" className="mb-6 mb-8 text-sm px-4 py-1">
            {post.category.toUpperCase()}
          </Badge>
        </Link>
      )}
      
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-6 leading-tight">
        {post.title}
      </h1>
      
      {post.excerpt && (
        <p className="text-xl md:text-2xl text-gray-500 mb-10 font-medium leading-relaxed">
          {post.excerpt}
        </p>
      )}

      <div className="flex items-center justify-center pt-8 border-t border-[#E6E6E6]">
        {post.author_avatar && (
          <img src={post.author_avatar} alt={post.author_name || 'Author'} className="w-14 h-14 rounded-full mr-4 object-cover" />
        )}
        <div className="text-left">
          <p className="text-base font-bold text-black">{post.author_name || 'Anonymous'}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>{formatDate(post.created_at)}</span>
            <span className="mx-2">&middot;</span>
            <span>{readTime} min read</span>
            <span className="mx-2">&middot;</span>
            <span className="flex items-center">
              {post.views} views
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
