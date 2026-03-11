import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

// Layouts
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Category } from './pages/public/Category';
import { Post } from './pages/public/Post';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Posts } from './pages/admin/Posts';
import { PostForm } from './pages/admin/PostForm';
import { Comments } from './pages/admin/Comments';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading admin session...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/blog/:slug" element={<Post />} />
        </Route>

        {/* Admin Login (unprotected) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/new" element={<PostForm />} />
          <Route path="posts/:id/edit" element={<PostForm />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-20 text-center"><h1 className="text-4xl font-bold">404 Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
