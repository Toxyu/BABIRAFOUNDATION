import { createClient } from '@supabase/supabase-js'
const url = "https://gqzsthdhxlwzdnqmiqxi.supabase.co"
const key = "sb_publishable_1jzIBnVIrlf6bypJ5UK5tQ_R8MHLVsK"
export const supabase = createClient(url, key)
