-- 1. Ensure blog_posts has all expected columns
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  short_introduction TEXT,
  body TEXT,
  content TEXT,
  media_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS short_introduction TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS media_url TEXT;

-- 2. Create foundation_settings table
CREATE TABLE IF NOT EXISTS public.foundation_settings (
  id INT PRIMARY KEY DEFAULT 1,
  registration_doc_url TEXT,
  organization_logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

INSERT INTO public.foundation_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Blog" ON public.blog_posts;
CREATE POLICY "Public Read Blog" ON public.blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Blog" ON public.blog_posts;
CREATE POLICY "Admin Full Access Blog" ON public.blog_posts FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Settings" ON public.foundation_settings;
CREATE POLICY "Public Read Settings" ON public.foundation_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Settings" ON public.foundation_settings;
CREATE POLICY "Admin Full Access Settings" ON public.foundation_settings FOR ALL USING (true);

-- 4. Reload schema cache
NOTIFY pgrst, 'reload schema';
