import { useState, useEffect } from 'react';
import { X, Search as SearchIcon, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchPosts } from '../../lib/api';
import { Post } from '../../types';
import { formatDate } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    } else {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchPosts(query);
        setResults(data);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 lg:p-8 border-b border-gray-200">
        <div className="w-10"></div> {/* Spacer */}
        <div className="flex-1 max-w-4xl mx-auto flex items-center border-b-2 border-primary pb-2">
          <SearchIcon size={28} className="text-gray-400 mr-4" />
          <input
            id="search-input"
            type="text"
            placeholder="Search news, topics, and authors..."
            className="w-full bg-transparent text-2xl lg:text-4xl font-serif font-bold text-primary outline-none placeholder:text-gray-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-primary p-2">
              <X size={24} />
            </button>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-primary ml-4"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="flex justify-center p-12">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center p-12 text-gray-500 font-sans text-lg">
              No results found for "<span className="font-bold text-primary">{query}</span>"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-6 lg:space-y-8 pb-16">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-500 mb-6">
                {results.length} Results
              </h3>
              {results.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  onClick={onClose}
                  className="flex flex-col md:flex-row gap-6 group items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-full md:w-1/3 aspect-[3/2] overflow-hidden rounded">
                    <img 
                      src={post.cover_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80'} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-1">
                    {post.category && (
                       <div className="mb-3">
                         <Badge variant="outline" className="text-accent-red border-accent-red">
                           {post.category.name}
                         </Badge>
                       </div>
                    )}
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent-blue transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 font-sans line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto text-sm text-gray-500 font-sans flex items-center">
                      <span className="font-bold text-primary mr-2">
                        {post.author?.name || (post.author as any)?.full_name || 'Staff'}
                      </span>
                      <span>•</span>
                      <span className="ml-2">{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="mt-8">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-500 mb-6 border-b border-gray-200 pb-2">
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Artificial Intelligence', 'Global Markets', 'Federal Reserve', 'Startups', 'Tech Earnings', 'Real Estate'].map(topic => (
                  <button 
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-sans font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors hover:border-gray-300"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
