CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert a subscription' AND tablename = 'subscriptions'
  ) THEN
    CREATE POLICY "Anyone can insert a subscription" 
    ON public.subscriptions FOR INSERT 
    TO public
    WITH CHECK (true);
  END IF;
END $$;
