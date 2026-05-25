import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export type EvaluationType = 'technical' | 'behavioral';

export interface Evaluation extends ServiceRecord {
  id: string;
  evaluation_type: EvaluationType;
  employee_id: string;
  leader_id?: string;
  project_id?: string;
  period: string;
  created_at?: string;
}

export type CreateEvaluationData = Omit<Evaluation, 'id' | 'created_at'> & ServiceRecord;

export async function createEvaluation(data: CreateEvaluationData): Promise<Evaluation> {
  const client = getSupabaseClient();
  const { data: evaluation, error } = await client
    .from('evaluations')
    .insert(data)
    .select()
    .single();

  return requireData(evaluation as Evaluation | null, error);
}

export async function getEvaluationsByEmployee(id: string): Promise<Evaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('evaluations')
    .select('*')
    .eq('employee_id', id)
    .order('created_at', { ascending: false });

  return requireData(data as Evaluation[] | null, error);
}

export async function getEvaluationsByLeader(id: string): Promise<Evaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('evaluations')
    .select('*')
    .eq('leader_id', id)
    .order('created_at', { ascending: false });

  return requireData(data as Evaluation[] | null, error);
}

export async function getEvaluationsByProject(id: string): Promise<Evaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('evaluations')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  return requireData(data as Evaluation[] | null, error);
}

/** Alias explícito para liderança: busca feedbacks recorrentes de um colaborador */
export async function getRecurringFeedbacksForEmployee(employeeId: string): Promise<Evaluation[]> {
  return getEvaluationsByEmployee(employeeId);
}
