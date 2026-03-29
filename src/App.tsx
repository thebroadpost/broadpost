import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/public/Home'));
const Category = lazy(() => import('./pages/public/Category'));
const Post = lazy(() => import('./pages/public/Post'));
const About = lazy(() => import('./pages/public/About'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/public/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/public/CookiePolicy'));
const Accessibility = lazy(() => import('./pages/public/Accessibility'));

// Account Pages
const AccountLayout = lazy(() => import('./pages/public/account/AccountLayout'));
const Profile = lazy(() => import('./pages/public/account/Profile'));
const Settings = lazy(() => import('./pages/public/account/Settings'));
const ReadingList = lazy(() => import('./pages/public/account/ReadingList'));
const Notifications = lazy(() => import('./pages/public/account/Notifications'));
const Newsletters = lazy(() => import('./pages/public/account/Newsletters'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminPosts = lazy(() => import('./pages/admin/Posts'));
const AdminPostForm = lazy(() => import('./pages/admin/PostForm'));
const AdminPostAnalytics = lazy(() => import('./pages/admin/PostAnalytics'));
const AdminComments = lazy(() => import('./pages/admin/Comments'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white dark:bg-gray-900 transition-colors duration-200">
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="flex-grow pt-[104px]">
                <Suspense fallback={<LoadingFallback />}>
                  <Outlet />
                </Suspense>
              </main>
              <Footer />
            </>
          }>
            <Route index element={<Home />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="blog/*" element={<Post />} />
            <Route path="about" element={<About />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="accessibility" element={<Accessibility />} />
            
            {/* Account Routes */}
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<Navigate to="/account/profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reading-list" element={<ReadingList />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="newsletters" element={<Newsletters />} />
            </Route>
            
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
            <Route path="posts/:postId/analytics" element={<AdminPostAnalytics />} />
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
    </ThemeProvider>
  );
}

export default App;
