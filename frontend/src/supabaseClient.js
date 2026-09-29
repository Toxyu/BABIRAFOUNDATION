import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback credentials to guarantee connection on GitHub Pages builds
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nwhspxhnjutotzyztzfg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
