import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
const legacyAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const browserKey = publishableKey || legacyAnonKey;

export const isSupabaseConfigured = Boolean(projectUrl && browserKey);
export const supabaseConfigurationMessage = isSupabaseConfigured
  ? ''
  : 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.';

if (!isSupabaseConfigured && import.meta.env.DEV) console.warn(`[LokTaal] ${supabaseConfigurationMessage}`);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(projectUrl!, browserKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error(supabaseConfigurationMessage);
  return supabase;
}
