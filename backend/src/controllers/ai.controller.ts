import { Request, Response } from 'express';
import { analyzeWithGemini, type FeedbackEntry } from '../services/gemini.service';

export async function analyzeFeedbacks(req: Request, res: Response): Promise<void> {
  const { employee_name, feedbacks } = req.body as {
    employee_name?: string;
    feedbacks?: FeedbackEntry[];
  };

  if (!employee_name || !Array.isArray(feedbacks) || feedbacks.length === 0) {
    res.status(400).json({
      error: 'Campos obrigatórios: employee_name (string) e feedbacks (array não vazio).',
    });
    return;
  }

  try {
    const insights = await analyzeWithGemini(employee_name, feedbacks);
    res.json({ insights });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';

    if (message.includes('GEMINI_API_KEY')) {
      res.status(500).json({ error: message });
      return;
    }

    if (message.includes('JSON')) {
      res.status(500).json({ error: 'Resposta da IA não é um JSON válido.' });
      return;
    }

    res.status(500).json({ error: `Falha ao chamar a API Gemini: ${message}` });
  }
}
