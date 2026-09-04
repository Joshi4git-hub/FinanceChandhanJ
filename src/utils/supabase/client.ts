import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    'https://ivbyoyqxnkhvfbeaoesl.supabase.co'

  const supabaseAnonKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    'sb_publishable_eUhgdFogu_zW04cFvpTefg_gCV8hdZy'

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
