-- 1. Ensure blog_posts supports rich media (videos, photo stories)
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'story';

-- 2. Create Community Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount NUMERIC(10,2) DEFAULT 0,
  raised_amount NUMERIC(10,2) DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Advertisements Table
CREATE TABLE IF NOT EXISTS public.advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  banner_url TEXT,
  link_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Announcements" ON public.announcements;
CREATE POLICY "Admin All Announcements" ON public.announcements FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Campaigns" ON public.campaigns;
CREATE POLICY "Public Read Campaigns" ON public.campaigns FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Campaigns" ON public.campaigns;
CREATE POLICY "Admin All Campaigns" ON public.campaigns FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Ads" ON public.advertisements;
CREATE POLICY "Public Read Ads" ON public.advertisements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Ads" ON public.advertisements;
CREATE POLICY "Admin All Ads" ON public.advertisements FOR ALL USING (true);

NOTIFY pgrst, 'reload schema';
