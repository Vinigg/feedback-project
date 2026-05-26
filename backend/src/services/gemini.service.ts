import { GoogleGenerativeAI } from '@google/generative-ai';

export interface FeedbackEntry {
  evaluation_type: string;
  period: string;
  answers: Record<string, string>;
}

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

function formatFeedbacks(items: FeedbackEntry[]): string {
  return items
    .map((f) => {
      const fields = Object.entries(f.answers ?? {})
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join('\n');
      return `Período ${f.period}:\n${fields || '  (sem campos preenchidos)'}`;
    })
    .join('\n\n');
}

export async function analyzeWithGemini(
  employeeName: string,
  feedbacks: FeedbackEntry[],
): Promise<AIInsights> {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no servidor.');
  }

  const technicalFeedbacks = feedbacks.filter((f) => f.evaluation_type === 'technical');
  const behavioralFeedbacks = feedbacks.filter((f) => f.evaluation_type === 'behavioral');

  const prompt = `
Você é um especialista em gestão de pessoas e desenvolvimento de talentos.
Analise os feedbacks recorrentes abaixo do colaborador "${employeeName}" e gere insights consolidados para apoiar a construção de uma avaliação formal de desempenho semestral.

FEEDBACKS TÉCNICOS (${technicalFeedbacks.length} registros):
${technicalFeedbacks.length > 0 ? formatFeedbacks(technicalFeedbacks) : '(Nenhum feedback técnico registrado)'}

FEEDBACKS COMPORTAMENTAIS (${behavioralFeedbacks.length} registros):
${behavioralFeedbacks.length > 0 ? formatFeedbacks(behavioralFeedbacks) : '(Nenhum feedback comportamental registrado)'}

Baseado nesses dados, retorne um JSON com exatamente esta estrutura:
{
  "positive_evolution": ["lista de competências ou comportamentos com evolução positiva observada"],
  "recurring_issues": ["lista de dificuldades ou pontos recorrentes de melhoria"],
  "score_suggestions": {
    "technical": {
      "Qualidade": <número de 1 a 5>,
      "Desempenho": <número de 1 a 5>,
      "Aprendizado": <número de 1 a 5>,
      "Mentoria": <número de 1 a 5>,
      "Arquitetura": <número de 1 a 5>
    },
    "behavioral": {
      "Comunicação": <número de 1 a 5>,
      "Proatividade": <número de 1 a 5>,
      "Colaboração": <número de 1 a 5>,
      "Iniciativa": <número de 1 a 5>,
      "Liderança": <número de 1 a 5>
    }
  },
  "technical_summary": "resumo técnico do período em 3 a 4 frases",
  "behavioral_summary": "resumo comportamental do período em 3 a 4 frases",
  "trends": ["lista de tendências percebidas nos feedbacks ao longo do tempo"],
  "career_recommendation": "<uma das opções: efetivação, promoção, permanência, desligamento>"
}

IMPORTANTE: Retorne APENAS o JSON válido, sem markdown, sem código delimitador, sem texto adicional.
`.trim();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  return JSON.parse(jsonText) as AIInsights;
}
