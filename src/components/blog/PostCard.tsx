import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate, calculateReadTime, truncateText } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  variant?: 'featured' | 'standard' | 'horizontal' | 'small' | 'minimal' | 'opinion';
}

export const PostCard = memo(function PostCard({ post, variant = 'standard' }: PostCardProps) {
  const readTime = calculateReadTime(post.content);
  const isHeroImage = variant === 'featured';
  const imageLoading: 'eager' | 'lazy' = isHeroImage ? 'eager' : 'lazy';
  const imageFetchPriority: 'high' | 'auto' = isHeroImage ? 'high' : 'auto';
  
  if (variant === 'featured') {
    return (
      <Link to={`/blog/${post.slug}`} className="group relative block w-full h-full overflow-hidden bg-primary cursor-pointer">
        <div className="absolute inset-0">
          <img 
            src={post.cover_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105"
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <Badge variant="red" className="mb-4 shadow-md bg-accent-red font-bold text-white tracking-widest px-2 py-1">
              {post.category?.name || 'News'}
            </Badge>
          </div>
          <div className="mt-auto">
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-white leading-tight mb-4 group-hover:underline decoration-2 underline-offset-4">
              {post.title}
            </h2>
            <div className="flex items-center text-gray-300 text-sm font-sans tracking-wide">
              <span className="font-bold text-white mr-2">{post.author?.name || 'Staff'}</span>
              <span>•</span>
              <span className="mx-2">{formatDate(post.published_at || post.created_at)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'small') {
    return (
      <Link to={`/blog/${post.slug}`} className="group flex items-start space-x-4 py-4 cursor-pointer">
        <div className="flex-shrink-0 w-[120px] h-[80px] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={post.cover_image || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&q=80'} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-wider mb-1 block">
            {post.category?.name || 'News'}
          </span>
          <h3 className="font-sans font-bold text-[15px] leading-snug text-primary dark:text-gray-200 group-hover:text-accent-blue dark:group-hover:text-blue-400 mb-2 transition-colors">
            {post.title}
          </h3>
          <div className="text-xs text-gray-500 font-sans mt-auto">
            <span className="text-gray-900 dark:text-gray-300 font-medium">{post.author?.name || 'Staff'}</span> • {formatDate(post.published_at || post.created_at)}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/blog/${post.slug}`} className="group flex flex-col md:flex-row gap-6 mb-8 cursor-pointer">
        <div className="w-full md:w-[45%] h-[250px] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <img 
             src={post.cover_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'} 
             alt={post.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             loading="lazy"
             decoding="async"
          />
        </div>
        <div className="w-full md:w-[55%] flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-accent-blue font-bold text-xs uppercase tracking-wider block">
              {post.category?.name || 'News'}
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl lg:text-3xl leading-tight text-primary dark:text-gray-200 group-hover:text-accent-blue dark:group-hover:text-blue-400 transition-colors mb-3">
            {post.title}
          </h2>
          <p className="font-sans text-gray-700 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-4 hidden md:block">
            {truncateText(post.excerpt || post.content.replace(/<[^>]*>?/gm, ''), 150)}
          </p>
          <div className="flex items-center text-xs text-gray-500 font-sans mt-auto font-medium">
            <span className="text-primary dark:text-gray-300 font-bold mr-2">{post.author?.name || 'Staff'}</span>
            <span>•</span>
            <span className="mx-2">{formatDate(post.published_at || post.created_at)}</span>
            <span>•</span>
            <span className="mx-2 flex items-center"><Clock size={12} className="mr-1" /> {readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link to={`/blog/${post.slug}`} className="block group">
        <div className="w-full h-40 md:h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
           <img 
             src={post.cover_image || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80'} 
             alt={post.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             loading="lazy"
             decoding="async"
           />
        </div>
        <span className="text-accent-blue font-bold text-[10px] uppercase tracking-wider mb-1 block">
          {post.category?.name || 'News'}
        </span>
        <h3 className="font-serif font-bold text-lg leading-tight text-primary dark:text-gray-200 group-hover:text-accent-blue dark:group-hover:text-blue-400 transition-colors mb-2">
          {post.title}
        </h3>
        <div className="text-xs text-gray-500 font-sans mt-auto">
          {formatDate(post.published_at || post.created_at)}
        </div>
      </Link>
    );
  }

  if (variant === 'opinion') {
    return (
      <Link to={`/blog/${post.slug}`} className="block group border border-border dark:border-gray-800 p-6 hover:shadow-sm transition-shadow bg-gray-50/50 dark:bg-gray-800/50 rounded-sm">
        <div className="flex items-center space-x-4 mb-4 border-b border-border dark:border-gray-800 pb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
             <img src={post.author?.avatar_url || 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png'} alt={post.author?.name} className="w-full h-full object-cover grayscale" loading="lazy" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-primary dark:text-white uppercase text-sm tracking-wide">{post.author?.name || 'Contributor'}</h4>
            <span className="text-xs text-gray-500">{post.author?.bio || 'Guest Contributor'}</span>
          </div>
        </div>
        <h3 className="font-serif font-bold text-2xl leading-tight text-primary dark:text-gray-200 group-hover:text-accent-blue dark:group-hover:text-blue-400 transition-colors mb-3">
          {post.title}
        </h3>
        <p className="font-sans text-gray-700 dark:text-gray-400 text-sm leading-relaxed mb-4 italic">
          "{truncateText(post.excerpt || post.content.replace(/<[^>]*>?/gm, ''), 100)}"
        </p>
      </Link>
    );
  }

  // Standard Grid Card
  return (
    <Link to={`/blog/${post.slug}`} className="block group flex flex-col h-full cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800 p-2 -m-2 transition-all">
      <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 block">
        <img 
          src={post.cover_image || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&q=80'} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mb-2">
        <span className="text-accent-blue font-bold text-[11px] uppercase tracking-wider">
          {post.category?.name || 'News'}
        </span>
      </div>
      <h3 className="font-serif font-bold text-xl leading-tight text-primary dark:text-gray-200 group-hover:text-accent-blue dark:group-hover:text-blue-400 transition-colors mb-2">
        {post.title}
      </h3>
      <p className="font-sans text-gray-700 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow hidden sm:block">
        {truncateText(post.excerpt || post.content.replace(/<[^>]*>?/gm, ''), 90)}
      </p>
      <div className="flex items-center text-xs text-gray-500 font-sans mt-auto pt-2">
        <span className="text-primary dark:text-gray-300 font-semibold mr-2">{post.author?.name || 'Staff'}</span>
        <span>•</span>
        <span className="mx-2">{formatDate(post.published_at || post.created_at)}</span>
        <span>•</span>
        <span className="mx-2 flex items-center"><Clock size={12} className="mr-1" /> {readTime} min</span>
      </div>
    </Link>
  );
});
