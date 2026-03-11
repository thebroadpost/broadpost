import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              BROADPOST
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link to="/category/finance" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Categories</Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">About</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/admin/login">
              <span className="text-sm text-gray-600 hover:text-black mr-4 cursor-pointer hidden sm:inline-block">
                Sign In
              </span>
            </Link>
            <Link to="/admin">
              <Button className="rounded-full flex items-center space-x-2">
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
