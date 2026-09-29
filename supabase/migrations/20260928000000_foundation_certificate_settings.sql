CREATE TABLE IF NOT EXISTS public.foundation_settings (
  id INT PRIMARY KEY DEFAULT 1,
  certificate_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.foundation_settings ADD COLUMN IF NOT EXISTS certificate_url TEXT;

INSERT INTO public.foundation_settings (id, certificate_url)
VALUES (1, '')
ON CONFLICT (id) DO NOTHING;
