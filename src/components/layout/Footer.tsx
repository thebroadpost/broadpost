import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-4 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 border-b border-gray-700 pb-16">
          <div className="mb-10 md:mb-0 max-w-sm">
            <Link to="/" className="font-serif font-bold text-4xl mb-4 block">
              BROADPOST
            </Link>
            <p className="text-gray-400 font-serif italic text-lg mb-6">"Insight. Analysis. Opinion."</p>
            <p className="text-sm text-gray-400">
              The premier digital destination for deep analysis, breaking business news, and unparalleled editorial insight.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 w-full md:w-auto">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Categories</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/category/business" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link to="/category/tech" className="hover:text-white transition-colors">Technology</Link></li>
                <li><Link to="/category/markets" className="hover:text-white transition-colors">Markets</Link></li>
                <li><Link to="/category/opinion" className="hover:text-white transition-colors">Opinion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Follow Us</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} BROADPOST Media LLC. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <Link to="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
