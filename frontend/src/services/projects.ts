import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export interface Project extends ServiceRecord {
  id: string;
  name: string;
  description?: string;
  status?: string;
  created_at?: string;
}

export interface ProjectMember extends ServiceRecord {
  id: string;
  project_id: string;
  employee_id: string;
  role?: string;
  status?: string;
  created_at?: string;
}

export async function getProjects(): Promise<Project[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('name', { ascending: true });

  return requireData(data as Project[] | null, error);
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('project_members')
    .select('*, profiles(*)')
    .eq('project_id', projectId);

  return requireData(data as ProjectMember[] | null, error);
}

export async function getProjectRoleNames(): Promise<string[]> {
  const client = getSupabaseClient();
  const [rolesResponse, membersResponse] = await Promise.all([
    client.from('roles').select('name').order('name', { ascending: true }),
    client
      .from('project_members')
      .select('role_in_project')
      .not('role_in_project', 'is', null)
      .order('role_in_project', { ascending: true }),
  ]);

  const roles = requireData(rolesResponse.data as { name: string | null }[] | null, rolesResponse.error);
  const members = requireData(
    membersResponse.data as { role_in_project: string | null }[] | null,
    membersResponse.error,
  );

  return Array.from(
    new Set([
      ...roles.map((row) => row.name?.trim()).filter((role): role is string => Boolean(role)),
      ...members.map((row) => row.role_in_project?.trim()).filter((role): role is string => Boolean(role)),
    ]),
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export async function getMyProjects(userId: string): Promise<Project[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('project_members')
    .select('projects(*)')
    .eq('employee_id', userId);

  const rows = requireData(data as { projects: Project | Project[] | null }[] | null, error);

  return rows.flatMap((row) => {
    if (!row.projects) {
      return [];
    }

    return Array.isArray(row.projects) ? row.projects : [row.projects];
  });
}
