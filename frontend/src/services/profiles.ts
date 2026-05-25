import { getSupabaseClient, requireData } from './supabaseService';

export type ProfileRole = 'admin' | 'technical-leader' | 'behavioral-leader' | 'employee';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: ProfileRole;
  created_at?: string;
}

export async function getProfile(id: string): Promise<Profile> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  return requireData(data as Profile | null, error);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .order('name', { ascending: true });

  return requireData(data as Profile[] | null, error);
}

export async function getProfilesByRole(role: ProfileRole): Promise<Profile[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('name', { ascending: true });

  return requireData(data as Profile[] | null, error);
}
