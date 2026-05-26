import type { AIInsights } from './finalEvaluations';
import type { Evaluation } from './evaluations';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

export async function analyzeRecurringFeedbacks(params: {
  employee_name: string;
  feedbacks: Evaluation[];
}): Promise<AIInsights> {
  const baseUrl = BACKEND_URL ?? 'http://localhost:3000';

  const payload = {
    employee_name: params.employee_name,
    feedbacks: params.feedbacks.map((f) => ({
      evaluation_type: f.evaluation_type,
      period: f.period,
      answers: (f.answers as Record<string, string>) ?? {},
    })),
  };

  const response = await fetch(`${baseUrl}/api/ai/analyze-feedbacks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Erro HTTP ${response.status} ao chamar a IA.`);
  }

  const data = (await response.json()) as { insights: AIInsights };
  return data.insights;
}
