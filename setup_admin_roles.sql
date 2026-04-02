-- 1) Create user_roles table for app-level authorization
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'user')) DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2) Users can read only their own role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Users can read own role'
  ) THEN
    CREATE POLICY "Users can read own role"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3) Helper function to evaluate admin permissions in SQL policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 4) Assign admin role to your account (change email when needed)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'anubhav.ickk@gmail.com'
ON CONFLICT (user_id)
DO UPDATE SET role = EXCLUDED.role, updated_at = timezone('utc', now());

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'broadpost755@gmail.com'
ON CONFLICT (user_id)
DO UPDATE SET role = EXCLUDED.role, updated_at = timezone('utc', now());

-- 5) Harden admin policies to use role checks (instead of TO public)
DO $$
BEGIN
  IF to_regclass('public.posts') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow admins full access to posts" ON public.posts';
    EXECUTE 'CREATE POLICY "Allow admins full access to posts" ON public.posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;

  IF to_regclass('public.comments') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow admins full access to comments" ON public.comments';
    EXECUTE 'CREATE POLICY "Allow admins full access to comments" ON public.comments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;

  IF to_regclass('public.categories') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow admins full access to categories" ON public.categories';
    EXECUTE 'CREATE POLICY "Allow admins full access to categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;
