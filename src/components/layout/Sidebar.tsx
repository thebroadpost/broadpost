import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TrendingUp, Hash } from 'lucide-react';

export function Sidebar() {
  const categories = ['Finance', 'Business', 'Markets', 'Economy', 'Tech', 'World'];

  return (
    <aside className="space-y-10 py-8 sticky top-20">
      
      {/* Newsletter Signup */}
      <div className="bg-gray-50 p-6 rounded-xl border border-[#E6E6E6]">
        <h3 className="font-bold text-lg mb-2 text-black">Stay in the loop</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get the latest posts delivered right to your inbox. No spam, ever.
        </p>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Your email address" type="email" />
          <Button className="w-full" variant="primary">Subscribe</Button>
        </form>
      </div>

      {/* Popular Categories */}
      <div>
        <h3 className="font-bold text-sm tracking-widest text-gray-400 uppercase mb-4 flex items-center">
          <Hash className="w-4 h-4 mr-2" />
          Discover More
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="inline-block bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Mini-Posts Placeholder */}
      <div>
        <h3 className="font-bold text-sm tracking-widest text-gray-400 uppercase mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Trending Now
        </h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start group cursor-pointer">
              <span className="text-3xl font-bold text-gray-200 leading-none group-hover:text-gray-300 transition-colors">
                0{i}
              </span>
              <div>
                <Link to={`/blog/mock-post-${i}`} className="font-bold text-sm text-gray-900 group-hover:underline line-clamp-2">
                  The future of artificial intelligence in modern finance and trading algorithms
                </Link>
                <div className="text-xs text-gray-500 mt-1">Mar 10 &middot; 5 min read</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
