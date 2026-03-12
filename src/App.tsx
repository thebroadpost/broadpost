import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/public/Home'));
const Category = lazy(() => import('./pages/public/Category'));
const Post = lazy(() => import('./pages/public/Post'));
const About = lazy(() => import('./pages/public/About'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminPosts = lazy(() => import('./pages/admin/Posts'));
const AdminPostForm = lazy(() => import('./pages/admin/PostForm'));
const AdminComments = lazy(() => import('./pages/admin/Comments'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white">
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="flex-grow pt-[116px]">
                <Suspense fallback={<LoadingFallback />}>
                  <Outlet />
                </Suspense>
              </main>
              <Footer />
            </>
          }>
            <Route index element={<Home />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="blog/:slug" element={<Post />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <Suspense fallback={<LoadingFallback />}>
               <AdminLayout />
            </Suspense>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<AdminPostForm />} />
            <Route path="posts/:id/edit" element={<AdminPostForm />} />
            <Route path="comments" element={<AdminComments />} />
          </Route>
          
          <Route path="/admin/login" element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminLogin />
            </Suspense>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
