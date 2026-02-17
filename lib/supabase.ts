import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback for development if keys are missing
const isMock = !supabaseUrl || !supabaseAnonKey;

if (isMock && typeof window !== 'undefined') {
    console.warn('Supabase keys missing. Running in mock mode. Auth and DB features will be simulated.');
}

export const supabase = isMock
    ? null
    : createClient(supabaseUrl!, supabaseAnonKey!);

export const isSupabaseConfigured = !isMock;
