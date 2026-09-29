import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwhspxhnjutotzyztzfg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1jzIBnVIrlf6bypJ5UK5tQ_R8MHLVsK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
