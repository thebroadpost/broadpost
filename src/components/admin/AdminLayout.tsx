import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusSquare, MessageSquare, LogOut, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminLayout() {
  const { loading } = useAdmin();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'New Post', path: '/admin/posts/new', icon: PlusSquare },
    { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary dark:bg-black text-white hidden sm:flex sm:flex-col fixed h-full z-10 border-r border-gray-800/60">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <Link to="/" className="font-serif font-bold text-2xl tracking-tight">BROADPOST</Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded transition-colors ${
                  isActive ? 'bg-accent-blue text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium font-sans">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3 rounded hover:bg-gray-800"
          >
            <LogOut size={20} />
            <span className="font-medium font-sans">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-64 flex flex-col min-h-screen relative z-0">
        {/* Mobile Header */}
        <header className="sm:hidden h-16 bg-white dark:bg-gray-900 border-b border-border dark:border-gray-800 flex items-center px-4 justify-between">
          <Link to="/" className="font-serif font-bold text-xl text-primary dark:text-white">BROADPOST</Link>
          <button onClick={handleLogout} className="p-2 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-950 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}