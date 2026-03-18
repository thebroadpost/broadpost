import React, { useMemo, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { useAdmin } from '../../hooks/useAdmin';
import { isUserAllowedForAdmin } from '../../lib/adminAuth';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAdmin(false);
  const { signInWithGoogle } = useAuth();

  const nextPath = useMemo(() => {
    const nextParam = new URLSearchParams(location.search).get('next');
    if (nextParam && nextParam.startsWith('/admin')) {
      return nextParam;
    }
    return '/admin/dashboard';
  }, [location.search]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={nextPath} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Failed to login');
      setLoading(false);
    } else {
      const { data: userData } = await supabase.auth.getUser();

      if (!(await isUserAllowedForAdmin(userData.user))) {
        await supabase.auth.signOut();
        toast.error('This account does not have admin role in Supabase.');
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      navigate(nextPath, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(`/admin/login?next=${encodeURIComponent(nextPath)}`);
      // Redirect is handled by Supabase OAuth flow.
    } catch (error: any) {
      toast.error(error?.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded shadow-sm border border-border">
        <div>
          <h2 className="text-center text-4xl font-extrabold font-serif text-primary tracking-tight">
            BROADPOST
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-sans uppercase tracking-widest">
            Staff Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@broadpost.com"
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
              className="font-bold tracking-wider"
            >
              {loading ? 'Entering...' : 'Sign in'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-sans tracking-wider">or</span>
            </div>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
              className="font-bold tracking-wider"
            >
              Continue with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
