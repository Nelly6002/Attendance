import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  url && key && url !== 'https://your-project.supabase.co' && !key.includes('your-anon')
)

export const supabase = isSupabaseConfigured ? createClient(url, key) : null
