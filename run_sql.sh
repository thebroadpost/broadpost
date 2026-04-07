cat > setup_newsletters.sql <<'SQL'
-- Newsletter table + policies
-- Run this in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email_lower ON public.subscriptions (lower(email));

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscriptions'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', policy_name);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Anyone can insert a subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription by email" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can unsubscribe themselves" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can delete subscriptions" ON public.subscriptions;

CREATE POLICY "Anyone can insert a subscription"
  ON public.subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscription by email"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

CREATE POLICY "Users can unsubscribe themselves"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );
SQL

echo "Wrote setup_newsletters.sql"
