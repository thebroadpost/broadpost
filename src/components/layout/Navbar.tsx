import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Twitter, Linkedin, Facebook, User } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Button } from '../ui/Button';
import UserSidebar from './UserSidebar';
import SearchModal from './SearchModal';
import { useAuth } from '../../contexts/AuthContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Business', path: '/category/business' },
  { name: 'Finance', path: '/category/finance' },
  { name: 'Markets', path: '/category/markets' },
  { name: 'Economy', path: '/category/economy' },
  { name: 'Tech', path: '/category/tech' },
  { name: 'World', path: '/category/world' },
  { name: 'Opinion', path: '/category/opinion' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const today = formatDate(new Date().toISOString());

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-200 ${isScrolled ? 'shadow-sm' : ''}`}>
        {/* Top bar */}
        <div className="bg-primary text-white h-10 flex items-center justify-between px-4 lg:px-8 text-xs font-sans tracking-wide">
          <div className="flex items-center space-x-3 w-1/2 overflow-hidden whitespace-nowrap">
            <span className="bg-accent-red text-white font-bold px-2 py-0.5 rounded-sm uppercase flex-shrink-0">Breaking</span>
            <span className="truncate">Global markets react to new economic policies announced today.</span>
          </div>
          <div className="flex items-center space-x-6 hidden md:flex">
            <span>{today}</span>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-gray-300"><Twitter size={14} /></a>
              <a href="#" className="hover:text-gray-300"><Linkedin size={14} /></a>
              <a href="#" className="hover:text-gray-300"><Facebook size={14} /></a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="bg-white border-b border-border h-[76px] flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-primary hover:bg-gray-100 rounded">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
            <Link to="/" className="font-serif font-bold text-3xl lg:text-4xl text-primary tracking-tight">
              BROADPOST
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-sans text-sm font-semibold uppercase tracking-wide py-2 border-b-2 transition-colors ${
                    isActive ? 'border-accent-red text-primary' : 'border-transparent text-gray-700 hover:text-primary hover:border-gray-300'
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
              className="p-2 text-primary hover:bg-gray-100 rounded hidden sm:block"
            >
              <Search size={20} />
            </button>
            
            {user ? (
              <button 
                onClick={() => setIsUserSidebarOpen(true)}
                className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 p-1.5 pr-3 rounded-full border border-gray-200"
              >
                 {user.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Profile" className="w-6 h-6 rounded-full" />
                 ) : (
                   <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                     <User size={14} className="text-gray-500" />
                   </div>
                 )}
                 <span className="text-xs font-bold tracking-wide font-sans text-primary">Account</span>
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
              className="p-2 text-primary sm:hidden"
            >
              <Search size={20} />
            </button>
            
             {/* Mobile user icon */}
            <button 
              onClick={() => setIsUserSidebarOpen(true)}
              className="p-2 text-primary sm:hidden"
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
            <span className="font-serif font-bold text-4xl text-primary">BROADPOST</span>
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

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <UserSidebar isOpen={isUserSidebarOpen} onClose={() => setIsUserSidebarOpen(false)} />
    </>
  );
}
