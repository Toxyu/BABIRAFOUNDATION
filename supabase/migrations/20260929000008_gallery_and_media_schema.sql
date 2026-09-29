-- 1. Create Gallery Table for Photos and Videos with Titles and Stories
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'photo', -- 'photo' or 'video'
  media_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add video support columns to blog_posts if not present
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 3. Enable RLS for Gallery Table
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery;
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Gallery" ON public.gallery;
CREATE POLICY "Admin Full Access Gallery" ON public.gallery FOR ALL USING (true);

-- 4. Enable Supabase Storage Policies for media bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Media Bucket" ON storage.objects;
CREATE POLICY "Public Access Media Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Insert Media Bucket" ON storage.objects;
CREATE POLICY "Admin Insert Media Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Delete Media Bucket" ON storage.objects;
CREATE POLICY "Admin Delete Media Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'media');

NOTIFY pgrst, 'reload schema';
