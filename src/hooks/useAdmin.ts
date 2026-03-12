import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAdmin(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (requireAuth && !session?.user && location.pathname !== '/admin/login') {
        navigate('/admin/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (requireAuth && !session?.user && location.pathname !== '/admin/login') {
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, requireAuth, location.pathname]);

  return { user, loading };
}
