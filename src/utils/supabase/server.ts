import { createServerClient, type CookieOptions } from '@supabase/ssr'

export function createClient(cookieStore?: any) {
  const supabaseUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    'https://ivbyoyqxnkhvfbeaoesl.supabase.co'

  const supabaseKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    'sb_publishable_eUhgdFogu_zW04cFvpTefg_gCV8hdZy'

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        if (!cookieStore) return []
        if (typeof cookieStore.getAll === 'function') {
          return cookieStore.getAll()
        }
        return []
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          if (cookieStore && typeof cookieStore.set === 'function') {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
