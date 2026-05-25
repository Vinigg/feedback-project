import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export interface AIInsights {
  positive_evolution: string[];
  recurring_issues: string[];
  score_suggestions: {
    technical: Record<string, number>;
    behavioral: Record<string, number>;
  };
  technical_summary: string;
  behavioral_summary: string;
  trends: string[];
  career_recommendation: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type FinalEvalStatus = 'draft' | 'pending_approval' | 'published';
export type CareerRecommendation = 'efetivação' | 'promoção' | 'permanência' | 'desligamento';

export interface FinalEvaluation extends ServiceRecord {
  id: string;
  employee_id: string;
  period: string; // 'YYYY-S1' | 'YYYY-S2'
  status: FinalEvalStatus;

  technical_scores?: Record<string, number>;
  technical_summary?: string;

  behavioral_scores?: Record<string, number>;
  behavioral_summary?: string;

  overall_recommendation?: string;
  career_recommendation?: CareerRecommendation;

  ai_insights?: AIInsights;
  created_by?: string;

  tech_approval_status?: ApprovalStatus;
  tech_approved_by?: string;
  tech_approved_at?: string;
  tech_approval_comments?: string;

  behavioral_approval_status?: ApprovalStatus;
  behavioral_approved_by?: string;
  behavioral_approved_at?: string;
  behavioral_approval_comments?: string;

  hr_approval_status?: ApprovalStatus;
  hr_approved_by?: string;
  hr_approved_at?: string;
  hr_approval_comments?: string;

  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateFinalEvaluationData = Omit<FinalEvaluation, 'id' | 'created_at' | 'updated_at'>;

export const TECHNICAL_COMPETENCIES = ['Qualidade', 'Desempenho', 'Aprendizado', 'Mentoria', 'Arquitetura'] as const;
export const BEHAVIORAL_COMPETENCIES = ['Comunicação', 'Proatividade', 'Colaboração', 'Iniciativa', 'Liderança'] as const;

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

export function formatPeriodLabel(period: string): string {
  const match = period.match(/^(\d{4})-S([12])$/);
  if (!match) return period;
  return `${match[1]} — ${match[2] === '1' ? '1º Semestre' : '2º Semestre'}`;
}

export function getSemestralPeriods(count = 4): { value: string; label: string }[] {
  const periods: { value: string; label: string }[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let semester = now.getMonth() < 6 ? 1 : 2;

  for (let i = 0; i < count; i++) {
    const value = `${year}-S${semester}`;
    periods.push({ value, label: formatPeriodLabel(value) });
    semester -= 1;
    if (semester === 0) {
      semester = 2;
      year -= 1;
    }
  }
  return periods;
}

export function averageScores(scores: Record<string, number> | undefined): number {
  if (!scores) return 0;
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

function isFullyApproved(evaluation: FinalEvaluation): boolean {
  return (
    evaluation.tech_approval_status === 'approved' &&
    evaluation.behavioral_approval_status === 'approved' &&
    evaluation.hr_approval_status === 'approved'
  );
}

// -----------------------------------------------------------------------
// CRUD
// -----------------------------------------------------------------------

export async function createFinalEvaluation(
  data: CreateFinalEvaluationData,
): Promise<FinalEvaluation> {
  const client = getSupabaseClient();
  const { data: record, error } = await client
    .from('final_evaluations')
    .insert(data)
    .select()
    .single();

  return requireData(record as FinalEvaluation | null, error);
}

export async function updateFinalEvaluation(
  id: string,
  data: Partial<FinalEvaluation>,
): Promise<FinalEvaluation> {
  const client = getSupabaseClient();
  const { data: record, error } = await client
    .from('final_evaluations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  return requireData(record as FinalEvaluation | null, error);
}

export async function getFinalEvaluation(id: string): Promise<FinalEvaluation> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('final_evaluations')
    .select('*')
    .eq('id', id)
    .single();

  return requireData(data as FinalEvaluation | null, error);
}

/** Todas as avaliações finais de um colaborador (visão da liderança) */
export async function getFinalEvaluationsByEmployee(
  employeeId: string,
): Promise<FinalEvaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('final_evaluations')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });

  return requireData(data as FinalEvaluation[] | null, error);
}

/** Somente avaliações publicadas — usada pelo colaborador */
export async function getPublishedFinalEvaluations(
  employeeId: string,
): Promise<FinalEvaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('final_evaluations')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return requireData(data as FinalEvaluation[] | null, error);
}

/** Todas as avaliações finais — visão do admin */
export async function getAllFinalEvaluations(): Promise<FinalEvaluation[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('final_evaluations')
    .select('*')
    .order('created_at', { ascending: false });

  return requireData(data as FinalEvaluation[] | null, error);
}

/** Avaliações pendentes de aprovação para o papel fornecido */
export async function getPendingApprovals(
  role: 'technical' | 'behavioral' | 'hr',
): Promise<FinalEvaluation[]> {
  const client = getSupabaseClient();
  const statusColumn =
    role === 'technical'
      ? 'tech_approval_status'
      : role === 'behavioral'
        ? 'behavioral_approval_status'
        : 'hr_approval_status';

  const { data, error } = await client
    .from('final_evaluations')
    .select('*')
    .eq('status', 'pending_approval')
    .eq(statusColumn, 'pending')
    .order('created_at', { ascending: false });

  return requireData(data as FinalEvaluation[] | null, error);
}

/** Submeter para aprovação (muda status de draft para pending_approval) */
export async function submitForApproval(id: string): Promise<FinalEvaluation> {
  return updateFinalEvaluation(id, { status: 'pending_approval' });
}

/** Aprovar uma avaliação final; auto-publica quando os três aprovam */
export async function approveFinalEvaluation(
  id: string,
  role: 'technical' | 'behavioral' | 'hr',
  userId: string,
  comments?: string,
): Promise<FinalEvaluation> {
  const now = new Date().toISOString();
  const updates: Partial<FinalEvaluation> = {};

  if (role === 'technical') {
    updates.tech_approval_status = 'approved';
    updates.tech_approved_by = userId;
    updates.tech_approved_at = now;
    if (comments) updates.tech_approval_comments = comments;
  } else if (role === 'behavioral') {
    updates.behavioral_approval_status = 'approved';
    updates.behavioral_approved_by = userId;
    updates.behavioral_approved_at = now;
    if (comments) updates.behavioral_approval_comments = comments;
  } else {
    updates.hr_approval_status = 'approved';
    updates.hr_approved_by = userId;
    updates.hr_approved_at = now;
    if (comments) updates.hr_approval_comments = comments;
  }

  const evaluation = await updateFinalEvaluation(id, updates);

  if (isFullyApproved(evaluation)) {
    return updateFinalEvaluation(id, {
      status: 'published',
      published_at: now,
    });
  }

  return evaluation;
}

/** Rejeitar uma avaliação final — volta ao status draft */
export async function rejectFinalEvaluation(
  id: string,
  role: 'technical' | 'behavioral' | 'hr',
  userId: string,
  comments: string,
): Promise<FinalEvaluation> {
  const now = new Date().toISOString();
  const updates: Partial<FinalEvaluation> = { status: 'draft' };

  if (role === 'technical') {
    updates.tech_approval_status = 'rejected';
    updates.tech_approved_by = userId;
    updates.tech_approved_at = now;
    updates.tech_approval_comments = comments;
  } else if (role === 'behavioral') {
    updates.behavioral_approval_status = 'rejected';
    updates.behavioral_approved_by = userId;
    updates.behavioral_approved_at = now;
    updates.behavioral_approval_comments = comments;
  } else {
    updates.hr_approval_status = 'rejected';
    updates.hr_approved_by = userId;
    updates.hr_approved_at = now;
    updates.hr_approval_comments = comments;
  }

  return updateFinalEvaluation(id, updates);
}
