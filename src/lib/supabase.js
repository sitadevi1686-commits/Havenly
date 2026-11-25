import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[HAVENLY FULL-STACK ENGINE] Running in Simulated Cloud Mode.\n' +
    'All backend tables, role authorization, and atomic room operations are simulated with persistent storage.\n' +
    'To connect live Supabase cloud, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    'color: #C6A36A; font-weight: bold; font-size: 11px;'
  );
}
