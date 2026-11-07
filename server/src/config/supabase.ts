import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseClient && config.supabase.url && config.supabase.serviceRoleKey) {
    if (!config.supabase.url.includes('placeholder')) {
      try {
        supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
      } catch (err) {
        console.warn('[Supabase] Failed to initialize client, will use memory store fallback:', err);
      }
    }
  }
  return supabaseClient;
}
