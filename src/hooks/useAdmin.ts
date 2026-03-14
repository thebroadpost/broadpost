import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { isUserAllowedForAdmin } from '../lib/adminAuth';

export function useAdmin(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;

    const handleSession = async (session: Session | null) => {
      const nextUser = session?.user ?? null;
      const allowed = await isUserAllowedForAdmin(nextUser);

      if (isCancelled) return;

      setUser(allowed ? nextUser : null);
      setLoading(false);

      if (requireAuth && !allowed && location.pathname !== '/admin/login') {
        navigate('/admin/login', { replace: true });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      void handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, location.pathname]);

  return { user, loading };
}
