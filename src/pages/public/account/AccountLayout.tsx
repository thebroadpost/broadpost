import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { User, Bell, Bookmark, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AccountLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'My Profile', path: '/account/profile', icon: User },
    { name: 'Notifications', path: '/account/notifications', icon: Bell },
    { name: 'Reading List', path: '/account/reading-list', icon: Bookmark },
    { name: 'Settings', path: '/account/settings', icon: Settings },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-16 min-h-[70vh]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl text-primary mb-2">My Account</h1>
          <p className="text-gray-500 font-sans text-sm">Manage your preferences and access your saved articles.</p>
        </div>

        <nav className="flex flex-col space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-sans font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg p-6 lg:p-10 shadow-sm">
        <Outlet />
      </main>
    </div>
  );
}
