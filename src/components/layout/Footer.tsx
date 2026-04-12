import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../lib/api';
import { toCanonicalCategorySlug } from '../../lib/categories';
import { AdUnit } from '../ui/AdUnit';

export default function Footer() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const footerCategories = (categories && categories.length > 0)
    ? categories.slice(0, 4)
    : [
        { slug: 'business', name: 'Business' },
        { slug: 'technology', name: 'Technology' },
        { slug: 'markets', name: 'Markets' },
        { slug: 'opinion', name: 'Opinion' },
      ];

  return (
    <footer className="bg-primary dark:bg-gray-900 text-white pt-16 pb-8 px-4 lg:px-8 font-sans transition-colors duration-200 border-t border-transparent dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Ad Unit - Footer */}
        <div className="mb-12 bg-white dark:bg-gray-800 p-4 rounded">
          <AdUnit slot="5933434284" format="auto" />
        </div>
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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 w-full md:w-auto">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Categories</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                {footerCategories.map((category) => (
                  <li key={category.slug}>
                    <Link to={`/category/${toCanonicalCategorySlug(category.slug || category.name || '')}`} className="hover:text-white transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-300">
          <p>&copy; {new Date().getFullYear()} BROADPOST Media LLC. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
            <Link to="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
