import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://ivbyoyqxnkhvfbeaoesl.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) ||
  (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YnlveXF4bmtodmZiZWFvZXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTExODUsImV4cCI6MjEwMzMyNzE4NX0.h6ZOqUmr1v7NBwwMc3M0dzTq2Pq8nbF4oaHVw2XFXrk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
