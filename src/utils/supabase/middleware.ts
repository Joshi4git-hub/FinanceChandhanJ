import { createServerClient, type CookieOptions } from '@supabase/ssr'

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://ivbyoyqxnkhvfbeaoesl.supabase.co'

const supabaseKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_eUhgdFogu_zW04cFvpTefg_gCV8hdZy'

export interface CookieToSet {
  name: string
  value: string
  options?: CookieOptions
}

export const updateSession = async (request: any) => {
  let supabaseResponse = {
    cookies: {
      set: (_name: string, _value: string, _options?: CookieOptions) => {},
      get: (_name: string) => undefined,
      getAll: () => [] as Array<{ name: string; value: string }>,
    },
    headers: new Headers(),
  }

  // If in Next.js environment with Next.js Response
  try {
    const globalNextResponse = (globalThis as any).NextResponse
    if (globalNextResponse && typeof globalNextResponse.next === 'function') {
      supabaseResponse = globalNextResponse.next({
        request: {
          headers: request.headers,
        },
      })
    }
  } catch {
    // fallback to standard response object
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return typeof request.cookies?.getAll === 'function'
            ? request.cookies.getAll()
            : []
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            if (typeof request.cookies?.set === 'function') {
              request.cookies.set(name, value)
            }
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            if (typeof (supabaseResponse as any).cookies?.set === 'function') {
              (supabaseResponse as any).cookies.set(name, value, options)
            }
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  return supabaseResponse
}

export const createClient = (request: any) => {
  return updateSession(request)
}
