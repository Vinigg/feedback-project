import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export interface SummaryReport extends ServiceRecord {
  evaluated_employees: number;
  average_technical: number;
  average_behavioral: number;
  completion_rate: number;
}

export interface TopPerformer extends ServiceRecord {
  employee_id: string;
  name: string;
  role?: string;
  technical?: number;
  behavioral?: number;
  overall: number;
}

export interface DepartmentStats extends ServiceRecord {
  department: string;
  employees: number;
  avg_technical: number;
  avg_behavioral: number;
  overall: number;
}

interface ReportEvaluation extends ServiceRecord {
  employee_id?: string;
  evaluation_type?: string;
  period?: string;
}

interface ReportProfile extends ServiceRecord {
  id: string;
  name?: string;
  role?: string;
  department?: string;
}

interface EmployeeScores {
  employeeId: string;
  technical: number[];
  behavioral: number[];
}

const SCORE_FIELDS = ['overall', 'score', 'average', 'rating', 'final_score', 'total_score'];

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

function getEvaluationScore(evaluation: ReportEvaluation): number | null {
  for (const field of SCORE_FIELDS) {
    const value = evaluation[field];

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);

      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

async function getReportData(period: string) {
  const client = getSupabaseClient();
  const { data: evaluations, error: evaluationsError } = await client
    .from('evaluations')
    .select('*')
    .eq('period', period);

  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('*');

  return {
    evaluations: requireData(evaluations as ReportEvaluation[] | null, evaluationsError),
    profiles: requireData(profiles as ReportProfile[] | null, profilesError),
  };
}

function groupScoresByEmployee(evaluations: ReportEvaluation[]): Map<string, EmployeeScores> {
  const grouped = new Map<string, EmployeeScores>();

  for (const evaluation of evaluations) {
    if (!evaluation.employee_id) {
      continue;
    }

    const score = getEvaluationScore(evaluation);

    if (score === null) {
      continue;
    }

    const scores = grouped.get(evaluation.employee_id) ?? {
      employeeId: evaluation.employee_id,
      technical: [],
      behavioral: [],
    };

    if (evaluation.evaluation_type === 'technical') {
      scores.technical.push(score);
    } else if (evaluation.evaluation_type === 'behavioral') {
      scores.behavioral.push(score);
    }

    grouped.set(evaluation.employee_id, scores);
  }

  return grouped;
}

export async function getSummary(period: string): Promise<SummaryReport> {
  const { evaluations, profiles } = await getReportData(period);
  const employeeIds = new Set(evaluations.map((evaluation) => evaluation.employee_id).filter(Boolean));
  const technicalScores = evaluations
    .filter((evaluation) => evaluation.evaluation_type === 'technical')
    .map(getEvaluationScore)
    .filter((score): score is number => score !== null);
  const behavioralScores = evaluations
    .filter((evaluation) => evaluation.evaluation_type === 'behavioral')
    .map(getEvaluationScore)
    .filter((score): score is number => score !== null);
  const employees = profiles.filter((profile) => profile.role === 'employee');

  return {
    evaluated_employees: employeeIds.size,
    average_technical: average(technicalScores),
    average_behavioral: average(behavioralScores),
    completion_rate: employees.length === 0 ? 0 : round((employeeIds.size / employees.length) * 100),
  };
}

export async function getTopPerformers(period: string): Promise<TopPerformer[]> {
  const { evaluations, profiles } = await getReportData(period);
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const grouped = groupScoresByEmployee(evaluations);

  return Array.from(grouped.values())
    .map((scores) => {
      const technical = average(scores.technical);
      const behavioral = average(scores.behavioral);
      const scoreGroups = [technical, behavioral].filter((score) => score > 0);
      const profile = profilesById.get(scores.employeeId);

      return {
        employee_id: scores.employeeId,
        name: profile?.name ?? scores.employeeId,
        role: profile?.role,
        technical,
        behavioral,
        overall: average(scoreGroups),
      };
    })
    .sort((current, next) => next.overall - current.overall)
    .slice(0, 10);
}

export async function getDepartmentStats(period: string): Promise<DepartmentStats[]> {
  const { evaluations, profiles } = await getReportData(period);
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const grouped = groupScoresByEmployee(evaluations);
  const departments = new Map<string, { employees: Set<string>; technical: number[]; behavioral: number[] }>();

  for (const scores of grouped.values()) {
    const profile = profilesById.get(scores.employeeId);
    const department = profile?.department ?? profile?.role ?? 'Sem departamento';
    const stats = departments.get(department) ?? {
      employees: new Set<string>(),
      technical: [],
      behavioral: [],
    };

    stats.employees.add(scores.employeeId);
    stats.technical.push(...scores.technical);
    stats.behavioral.push(...scores.behavioral);
    departments.set(department, stats);
  }

  return Array.from(departments.entries())
    .map(([department, stats]) => {
      const avgTechnical = average(stats.technical);
      const avgBehavioral = average(stats.behavioral);
      const scoreGroups = [avgTechnical, avgBehavioral].filter((score) => score > 0);

      return {
        department,
        employees: stats.employees.size,
        avg_technical: avgTechnical,
        avg_behavioral: avgBehavioral,
        overall: average(scoreGroups),
      };
    })
    .sort((current, next) => next.overall - current.overall);
}
