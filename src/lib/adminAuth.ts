import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch user role from Supabase:', error);
    return null;
  }

  return data?.role ?? null;
}

export async function isEmailAllowedForAdmin(email?: string | null): Promise<boolean> {
  if (!email) {
    return false;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return false;
  }

  if (userData.user.email?.toLowerCase() !== email.toLowerCase()) {
    return false;
  }

  const role = await getUserRole(userData.user.id);
  return role === 'admin';
}

export async function isUserAllowedForAdmin(user?: User | null): Promise<boolean> {
  if (!user) return false;
  const role = await getUserRole(user.id);
  return role === 'admin';
}
