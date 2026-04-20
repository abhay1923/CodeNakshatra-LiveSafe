import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safe fallback so createClient doesn't throw on missing env vars
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co'
const safeKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl?.includes('YOUR_PROJECT_ID') &&
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey?.includes('YOUR_SUPABASE_ANON_KEY')
