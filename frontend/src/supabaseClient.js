import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables with fallback definitions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'babira-ndeda-foundation' },
  },
});
