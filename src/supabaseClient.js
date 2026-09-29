import { createClient } from '@supabase/supabase-js'

// HARDCODED for BABIRAFOUNDATION live site - works even if.env fails on GitHub Pages
const HARD_URL = "https://gqzsthdhxlwzdnqmiqxi.supabase.co"
const HARD_KEY = "sb_publishable_1jzIBnVIrlf6bypJ5UK5tQ_R8MHLVsK"

const url = import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL || HARD_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || window.SUPABASE_KEY || HARD_KEY

console.log("Supabase URL:", url)
export const supabase = createClient(url, key)
