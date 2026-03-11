import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6E6E6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <Link to="/" className="text-xl font-black tracking-tighter">
              BROADPOST
            </Link>
          </div>
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm">
              About
            </Link>
            <Link to="/category/tech" className="text-gray-500 hover:text-gray-900 text-sm">
              Technology
            </Link>
            <Link to="/category/finance" className="text-gray-500 hover:text-gray-900 text-sm">
              Finance
            </Link>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-[#E6E6E6] pt-8 flex items-center justify-between">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} BROADPOST. All rights reserved.</p>
          <div className="text-gray-400 text-sm">
            Powered by Vite & Supabase
          </div>
        </div>
      </div>
    </footer>
  );
}
