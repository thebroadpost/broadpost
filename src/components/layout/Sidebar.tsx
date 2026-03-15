import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingPosts, getFeaturedPosts, getCategories } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';
import { PostCard } from '../blog/PostCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { BookmarkButton } from '../blog/BookmarkButton';
import { subscribeToNewsletter } from '../../lib/api';
import toast from 'react-hot-toast';

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

  const [activeTab, setActiveTab] = useState<'trending' | 'editors'>('trending');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('Successfully subscribed to the newsletter!');
      setEmail(''); // clear form
    } catch (error: any) {
      if (error.message === 'Email is already subscribed') {
        toast.error('This email is already subscribed.');
      } else {
        toast.error(error?.message || 'Failed to subscribe. Please try again later.');
      }
    } finally {
      setSubscribing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <aside className="space-y-12 sticky top-24">
      
      {/* Trending / Editors' Picks Tabs */}
      <div>
        <div className="flex items-center space-x-6 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setActiveTab('trending')}
            className={`pb-3 font-serif font-bold text-xl transition-colors relative ${
              activeTab === 'trending' ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Trending
            {activeTab === 'trending' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent-red"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('editors')}
            className={`pb-3 font-serif font-bold text-xl transition-colors relative ${
              activeTab === 'editors' ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Editors' Picks
            {activeTab === 'editors' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent-red"></span>}
          </button>
        </div>
        
        {activeTab === 'trending' ? (
          /* Trending Look */
          trendingLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="flex flex-col">
              {trending?.map((post, index) => (
                <div key={post.id} className="group flex items-start py-5 border-b border-gray-100 dark:border-gray-800 last:border-0 relative pr-8">
                  <span className="font-serif text-[42px] leading-none text-accent-red mr-5 w-8 flex-shrink-0 pt-1">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <Link to={`/blog/${post.slug}`}>
                      <h4 className="font-serif font-bold text-[17px] leading-tight text-primary dark:text-white hover:text-accent-blue dark:hover:text-blue-400 transition-colors mb-2 pr-4">
                        {post.title}
                      </h4>
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 font-sans mt-2">
                       <TrendingUp size={14} className="text-accent-blue mr-1.5" />
                       <span className="font-medium tracking-wide">
                          {/* Formatting view count (e.g. 1500 -> 1.5K) */}
                          {post.views >= 1000 ? (post.views / 1000).toFixed(1) + 'K' : post.views} views in the past hour
                       </span>
                    </div>
                  </div>
                  <BookmarkButton 
                    postId={post.id} 
                    className="absolute right-0 top-6 p-2 -mr-2 text-accent-blue hover:text-blue-800 dark:hover:text-blue-400" 
                    size={18} 
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          /* Editor's Picks Look */
          editorsPicksLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
              {editorsPicks?.slice(0, 5).map((post) => (
                <div key={post.id} className="py-4 first:pt-0">
                  <PostCard post={post} variant="small" />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-primary dark:bg-gray-800 text-white p-8">
        <h3 className="font-serif font-bold text-2xl mb-4 leading-tight">Get BROADPOST in your inbox</h3>
        <p className="font-sans text-sm text-gray-300 mb-6">Sign up for our daily newsletter and get the most important stories curated by our editors.</p>
        <form className="space-y-3" onSubmit={handleSubscribe}>
          <Input 
            type="email" 
            placeholder="Email address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribing}
            className="border-none"
          />
          <Button 
            type="submit" 
            fullWidth 
            disabled={subscribing}
            className="font-bold tracking-widest uppercase bg-accent-blue hover:bg-blue-800 text-white border-none"
          >
            {subscribing ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed tracking-wide">
          By signing up, you accept and agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Popular Categories */}
      {categories && categories.length > 0 && (
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-6 border-b-2 border-primary dark:border-gray-700 pb-2">
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">Popular Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`}
                className="px-4 py-2 border border-border dark:border-gray-700 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary dark:hover:bg-gray-700 hover:text-white transition-colors"
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
