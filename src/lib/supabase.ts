import { supabase } from '../supabaseClient';

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  country: string | null;
  occupation: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export { supabase };
