import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';
import { averageScores } from './finalEvaluations';

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

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

interface ReportFinalEvaluation extends ServiceRecord {
  employee_id?: string;
  period?: string;
  technical_scores?: Record<string, number>;
  behavioral_scores?: Record<string, number>;
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

async function getReportData(period: string) {
  const client = getSupabaseClient();
  const { data: evaluations, error: evaluationsError } = await client
    .from('final_evaluations')
    .select('*')
    .eq('period', period)
    .eq('status', 'published');

  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('*');

  return {
    evaluations: requireData(evaluations as ReportFinalEvaluation[] | null, evaluationsError),
    profiles: requireData(profiles as ReportProfile[] | null, profilesError),
  };
}

function groupScoresByEmployee(evaluations: ReportFinalEvaluation[]): Map<string, EmployeeScores> {
  const grouped = new Map<string, EmployeeScores>();

  for (const ev of evaluations) {
    if (!ev.employee_id) continue;

    const techAvg = averageScores(ev.technical_scores);
    const behavAvg = averageScores(ev.behavioral_scores);

    const scores = grouped.get(ev.employee_id) ?? {
      employeeId: ev.employee_id,
      technical: [],
      behavioral: [],
    };

    if (techAvg > 0) scores.technical.push(techAvg);
    if (behavAvg > 0) scores.behavioral.push(behavAvg);

    grouped.set(ev.employee_id, scores);
  }

  return grouped;
}

export async function getSummary(period: string): Promise<SummaryReport> {
  const { evaluations, profiles } = await getReportData(period);
  const employeeIds = new Set(evaluations.map((ev) => ev.employee_id).filter(Boolean));
  const technicalScores = evaluations
    .map((ev) => averageScores(ev.technical_scores))
    .filter((s) => s > 0);
  const behavioralScores = evaluations
    .map((ev) => averageScores(ev.behavioral_scores))
    .filter((s) => s > 0);
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
