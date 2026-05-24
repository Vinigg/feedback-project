import { supabase } from '../lib/supabase';

export type ServiceRecord = Record<string, unknown>;

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    this.name = 'SupabaseNotConfiguredError';
  }
}

export function getSupabaseClient() {
  if (!supabase) {
    throw new SupabaseNotConfiguredError();
  }

  return supabase;
}

export function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }

  if (data === null) {
    throw new Error('No data returned from Supabase.');
  }

  return data;
}
