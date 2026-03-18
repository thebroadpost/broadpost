import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Menu, X, Twitter, Linkedin, Facebook, User } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { getPosts } from '../../lib/api';
import { CATEGORY_META } from '../../lib/categories';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar = lazy(() => import('./UserSidebar'));
const SearchModal = lazy(() => import('./SearchModal'));

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  ...CATEGORY_META.map((category) => ({
    name: category.name,
    path: `/category/${category.slug}`,
  })),
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [breakingIndex, setBreakingIndex] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  const { data: breakingPostsResponse } = useQuery({
    queryKey: ['breakingPosts'],
    queryFn: () => getPosts({ status: 'published' }, { limit: 20, page: 1 }),
    refetchInterval: 60_000,
  });

  const breakingPosts = useMemo(() => {
    const publishedPosts = breakingPostsResponse?.data || [];
    const pinnedPosts = publishedPosts.filter((post) => post.is_pinned);
    const candidates = pinnedPosts.length > 0 ? pinnedPosts : publishedPosts;
    return candidates.slice(0, 8);
  }, [breakingPostsResponse?.data]);

  const activeBreakingPost = breakingPosts[breakingIndex];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setBreakingIndex(0);
  }, [breakingPosts.length]);

  useEffect(() => {
    if (breakingPosts.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setBreakingIndex((current) => (current + 1) % breakingPosts.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [breakingPosts]);

  const today = formatDate(new Date().toISOString());

  const overlayFallback = (
    <div className="fixed inset-0 z-[80] bg-black/10 backdrop-blur-[1px]" aria-hidden="true" />
  );

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-200 ${isScrolled ? 'shadow-sm' : ''}`}>
        {/* Top bar */}
        <div className="bg-primary text-white h-9 flex items-center justify-between px-4 lg:px-6 text-[11px] font-sans tracking-wide">
          <div className="flex items-center space-x-3 w-1/2 overflow-hidden whitespace-nowrap">
            <span className="bg-accent-red text-white font-bold px-2 py-0.5 rounded-sm uppercase flex-shrink-0">Breaking</span>
            {activeBreakingPost ? (
              <Link
                to={`/blog/${activeBreakingPost.slug}`}
                className="truncate hover:text-gray-200 transition-colors"
                title={activeBreakingPost.title}
              >
                {activeBreakingPost.title}
              </Link>
            ) : (
              <span className="truncate">Global markets react to new economic policies announced today.</span>
            )}
          </div>
          <div className="hidden items-center space-x-6 md:flex">
            <span>{today}</span>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-gray-300"><Twitter size={14} /></a>
              <a href="#" className="hover:text-gray-300"><Linkedin size={14} /></a>
              <a href="#" className="hover:text-gray-300"><Facebook size={14} /></a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-border dark:border-gray-800 h-[68px] flex items-center justify-between px-4 lg:px-6 transition-colors duration-200">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
            <Link to="/" className="inline-flex items-center" aria-label="BROADPOST Home">
              <img
                src="/thebroadpostlogo.svg"
                alt="BROADPOST"
                className="h-9 w-auto lg:h-11"
                loading="eager"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-sans text-[13px] font-semibold uppercase tracking-wide py-2 border-b-2 transition-colors ${
                    isActive ? 'border-accent-red text-primary dark:text-white' : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded hidden sm:block transition-colors"
            >
              <Search size={20} />
            </button>
            
            {user ? (
              <button 
                onClick={() => setIsUserSidebarOpen(true)}
                className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 pr-3 rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
              >
                 {user.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Profile" className="w-6 h-6 rounded-full" />
                 ) : (
                   <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                     <User size={14} className="text-gray-500 dark:text-gray-400" />
                   </div>
                 )}
                 <span className="text-xs font-bold tracking-wide font-sans text-primary dark:text-white">Account</span>
              </button>
            ) : (
              <Button 
                onClick={() => setIsUserSidebarOpen(true)}
                size="sm" 
                className="hidden sm:inline-flex uppercase text-xs font-bold tracking-wider"
              >
                Sign In
              </Button>
            )}

            {/* Mobile search icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-primary dark:text-white sm:hidden"
            >
              <Search size={20} />
            </button>
            
             {/* Mobile user icon */}
            <button 
              onClick={() => setIsUserSidebarOpen(true)}
              className="p-2 text-primary dark:text-white sm:hidden"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 lg:hidden">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-primary"
          >
            <X size={32} />
          </button>
          
          <div className="mb-12">
            <img src="/thebroadpostlogo.svg" alt="BROADPOST" className="h-12 w-auto" loading="eager" />
          </div>
          
          <nav className="flex flex-col items-center space-y-6 w-full">
            {NAV_LINKS.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-2xl font-bold uppercase tracking-wider text-primary border-b-2 border-transparent hover:border-primary pb-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-12 flex space-x-6">
             <a href="#" className="p-3 bg-gray-100 rounded-full text-primary"><Twitter size={24} /></a>
             <a href="#" className="p-3 bg-gray-100 rounded-full text-primary"><Linkedin size={24} /></a>
             <a href="#" className="p-3 bg-gray-100 rounded-full text-primary"><Facebook size={24} /></a>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <Suspense fallback={overlayFallback}>
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
      {isUserSidebarOpen && (
        <Suspense fallback={overlayFallback}>
          <UserSidebar isOpen={isUserSidebarOpen} onClose={() => setIsUserSidebarOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
