import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles, Save, Send, ArrowLeft, ChevronDown, ChevronUp, Loader2,
  TrendingUp, AlertTriangle, Lightbulb, Star,
} from 'lucide-react';
import logoMesa from '../assets/logo-mesa.png';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getProfile, type Profile } from '../services/profiles';
import { getRecurringFeedbacksForEmployee } from '../services/evaluations';
import { analyzeRecurringFeedbacks } from '../services/aiService';
import {
  createFinalEvaluation,
  updateFinalEvaluation,
  submitForApproval,
  getSemestralPeriods,
  formatPeriodLabel,
  TECHNICAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES,
  type FinalEvaluation,
  type AIInsights,
  type CareerRecommendation,
} from '../services/finalEvaluations';

const CAREER_OPTIONS: { value: CareerRecommendation; label: string; color: string }[] = [
  { value: 'efetivação', label: 'Efetivação', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'promoção', label: 'Promoção', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'permanência', label: 'Permanência', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'desligamento', label: 'Desligamento', color: 'text-red-700 bg-red-50 border-red-200' },
];

function ScoreSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
            value >= n
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function FinalEvaluationForm() {
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { userId, profile: currentProfile } = useCurrentUser();

  const [employee, setEmployee] = useState<Profile | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const periods = getSemestralPeriods(6);

  // AI
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiExpanded, setAiExpanded] = useState(true);

  // Scores
  const [technicalScores, setTechnicalScores] = useState<Record<string, number>>(
    Object.fromEntries(TECHNICAL_COMPETENCIES.map((c) => [c, 3])),
  );
  const [behavioralScores, setBehavioralScores] = useState<Record<string, number>>(
    Object.fromEntries(BEHAVIORAL_COMPETENCIES.map((c) => [c, 3])),
  );
  const [technicalSummary, setTechnicalSummary] = useState('');
  const [behavioralSummary, setBehavioralSummary] = useState('');
  const [overallRecommendation, setOverallRecommendation] = useState('');
  const [careerRecommendation, setCareerRecommendation] = useState<CareerRecommendation | ''>('');

  // Draft state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    getProfile(employeeId)
      .then((emp) => {
        setEmployee(emp);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [employeeId]);

  // Pre-select current semester
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0].value);
    }
  }, [periods, selectedPeriod]);

  const handleGenerateAI = async () => {
    if (!employeeId || !selectedPeriod || !employee) return;
    setAiLoading(true);
    setAiError('');
    try {
      // Determine the date range for the selected semester
      const [year, sem] = selectedPeriod.split('-S');
      const startMonth = sem === '1' ? `${year}-01` : `${year}-07`;
      const endMonth = sem === '1' ? `${year}-06` : `${year}-12`;

      const feedbacks = await getRecurringFeedbacksForEmployee(employeeId);
      const filtered = feedbacks.filter((f) => f.period >= startMonth && f.period <= endMonth);

      if (filtered.length === 0) {
        setAiError(
          'Nenhum feedback recorrente encontrado para este período. A IA precisa de pelo menos um feedback para gerar insights.',
        );
        return;
      }

      const insights = await analyzeRecurringFeedbacks({
        employee_name: employee.name,
        feedbacks: filtered,
      });

      setAiInsights(insights);
      setAiExpanded(true);

      // Pre-fill scores from AI suggestions
      if (insights.score_suggestions?.technical) {
        setTechnicalScores((prev) => {
          const updated = { ...prev };
          for (const [k, v] of Object.entries(insights.score_suggestions.technical)) {
            if (k in updated) updated[k] = Math.min(5, Math.max(1, Math.round(v)));
          }
          return updated;
        });
      }
      if (insights.score_suggestions?.behavioral) {
        setBehavioralScores((prev) => {
          const updated = { ...prev };
          for (const [k, v] of Object.entries(insights.score_suggestions.behavioral)) {
            if (k in updated) updated[k] = Math.min(5, Math.max(1, Math.round(v)));
          }
          return updated;
        });
      }
      if (insights.technical_summary) setTechnicalSummary(insights.technical_summary);
      if (insights.behavioral_summary) setBehavioralSummary(insights.behavioral_summary);
      if (insights.career_recommendation) {
        const valid: CareerRecommendation[] = ['efetivação', 'promoção', 'permanência', 'desligamento'];
        if (valid.includes(insights.career_recommendation as CareerRecommendation)) {
          setCareerRecommendation(insights.career_recommendation as CareerRecommendation);
        }
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erro ao gerar insights com IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const buildPayload = (): Partial<FinalEvaluation> => ({
    employee_id: employeeId!,
    period: selectedPeriod,
    technical_scores: technicalScores,
    technical_summary: technicalSummary,
    behavioral_scores: behavioralScores,
    behavioral_summary: behavioralSummary,
    overall_recommendation: overallRecommendation,
    career_recommendation: careerRecommendation as CareerRecommendation,
    ai_insights: aiInsights ?? undefined,
    created_by: userId ?? undefined,
  });

  const handleSaveDraft = async () => {
    if (!employeeId || !selectedPeriod || !userId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      if (draftId) {
        await updateFinalEvaluation(draftId, buildPayload());
      } else {
        const created = await createFinalEvaluation({
          ...buildPayload(),
          status: 'draft',
          tech_approval_status: 'pending',
          behavioral_approval_status: 'pending',
          hr_approval_status: 'pending',
        } as Parameters<typeof createFinalEvaluation>[0]);
        setDraftId(created.id);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!careerRecommendation) {
      alert('Selecione uma recomendação de carreira antes de enviar para aprovação.');
      return;
    }
    setSubmitting(true);
    try {
      let id = draftId;
      if (!id) {
        const created = await createFinalEvaluation({
          ...buildPayload(),
          status: 'draft',
          tech_approval_status: 'pending',
          behavioral_approval_status: 'pending',
          hr_approval_status: 'pending',
        } as Parameters<typeof createFinalEvaluation>[0]);
        id = created.id;
        setDraftId(id);
      } else {
        await updateFinalEvaluation(id, buildPayload());
      }
      await submitForApproval(id);
      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMesa} alt="Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-lg sm:text-xl text-white">Nova Avaliação Final</h1>
              <p className="text-xs sm:text-sm text-white/60">
                {currentProfile?.name ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Employee + Period */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Identificação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Colaborador
              </label>
              <div className="px-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm">
                {employee?.name ?? employeeId}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Período de Avaliação
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {periods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={aiLoading || !selectedPeriod}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {aiLoading ? 'Analisando feedbacks...' : 'Gerar Insights com IA'}
            </button>
            {aiError && <p className="text-sm text-destructive mt-2">{aiError}</p>}
          </div>
        </div>

        {/* AI Insights Panel */}
        {aiInsights && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl mb-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setAiExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-violet-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <span className="font-medium text-violet-800">
                  Insights da IA — {formatPeriodLabel(selectedPeriod)}
                </span>
              </div>
              {aiExpanded ? (
                <ChevronUp className="w-4 h-4 text-violet-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-violet-600" />
              )}
            </button>

            {aiExpanded && (
              <div className="px-6 pb-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiInsights.positive_evolution.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Evolução Positiva</span>
                      </div>
                      <ul className="space-y-1">
                        {aiInsights.positive_evolution.map((item, i) => (
                          <li key={i} className="text-sm text-emerald-700 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiInsights.recurring_issues.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Pontos Recorrentes</span>
                      </div>
                      <ul className="space-y-1">
                        {aiInsights.recurring_issues.map((item, i) => (
                          <li key={i} className="text-sm text-amber-700 flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {aiInsights.trends.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-800">Tendências Identificadas</span>
                    </div>
                    <ul className="space-y-1">
                      {aiInsights.trends.map((item, i) => (
                        <li key={i} className="text-sm text-violet-700 flex items-start gap-1.5">
                          <span className="text-violet-500 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-violet-200">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Resumo Técnico (IA)</p>
                    <p className="text-sm text-muted-foreground">{aiInsights.technical_summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Resumo Comportamental (IA)</p>
                    <p className="text-sm text-muted-foreground">{aiInsights.behavioral_summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Scores */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-lg font-medium">Competências Técnicas</h2>
          </div>
          <div className="space-y-4">
            {TECHNICAL_COMPETENCIES.map((comp) => (
              <div key={comp} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{comp}</span>
                </div>
                <ScoreSelector
                  value={technicalScores[comp] ?? 3}
                  onChange={(v) => setTechnicalScores((prev) => ({ ...prev, [comp]: v }))}
                />
                <span className="text-sm text-muted-foreground w-6 text-right">
                  {technicalScores[comp] ?? 3}/5
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label className="text-sm font-medium mb-1.5 block">Resumo Técnico</label>
            <textarea
              value={technicalSummary}
              onChange={(e) => setTechnicalSummary(e.target.value)}
              rows={3}
              placeholder="Descreva o desempenho técnico do colaborador no período..."
              className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Behavioral Scores */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <h2 className="text-lg font-medium">Competências Comportamentais</h2>
          </div>
          <div className="space-y-4">
            {BEHAVIORAL_COMPETENCIES.map((comp) => (
              <div key={comp} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{comp}</span>
                </div>
                <ScoreSelector
                  value={behavioralScores[comp] ?? 3}
                  onChange={(v) => setBehavioralScores((prev) => ({ ...prev, [comp]: v }))}
                />
                <span className="text-sm text-muted-foreground w-6 text-right">
                  {behavioralScores[comp] ?? 3}/5
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label className="text-sm font-medium mb-1.5 block">Resumo Comportamental</label>
            <textarea
              value={behavioralSummary}
              onChange={(e) => setBehavioralSummary(e.target.value)}
              rows={3}
              placeholder="Descreva o comportamento e as soft skills do colaborador no período..."
              className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Overall Assessment */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Avaliação Geral</h2>
          <div className="mb-4">
            <label className="text-sm font-medium mb-1.5 block">Recomendação Geral</label>
            <textarea
              value={overallRecommendation}
              onChange={(e) => setOverallRecommendation(e.target.value)}
              rows={3}
              placeholder="Síntese do desempenho, potencial e próximos passos para o colaborador..."
              className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Recomendação de Carreira <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CAREER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCareerRecommendation(opt.value)}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    careerRecommendation === opt.value
                      ? opt.color + ' ring-2 ring-offset-1'
                      : 'bg-white text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {saveSuccess && (
            <span className="text-sm text-emerald-600 self-center">Rascunho salvo!</span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || !selectedPeriod}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-muted/30 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !selectedPeriod || !careerRecommendation}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Enviar para Aprovação
          </button>
        </div>
        {/* spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}
