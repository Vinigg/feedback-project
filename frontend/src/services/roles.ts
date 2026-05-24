import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export interface Role extends ServiceRecord {
  id: string;
  name: string;
  description?: string;
  department?: string;
  active_employees?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateRoleData = Omit<Role, 'id' | 'created_at' | 'updated_at'> & ServiceRecord;
export type UpdateRoleData = Partial<CreateRoleData>;

export async function getRoles(): Promise<Role[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('roles')
    .select('*')
    .order('name', { ascending: true });

  return requireData(data as Role[] | null, error);
}

export async function createRole(data: CreateRoleData): Promise<Role> {
  const client = getSupabaseClient();
  const { data: role, error } = await client
    .from('roles')
    .insert(data)
    .select()
    .single();

  return requireData(role as Role | null, error);
}

export async function updateRole(id: string, data: UpdateRoleData): Promise<Role> {
  const client = getSupabaseClient();
  const { data: role, error } = await client
    .from('roles')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  return requireData(role as Role | null, error);
}

export async function deleteRole(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('roles')
    .delete()
    .eq('id', id);

  requireData(true, error);
}
