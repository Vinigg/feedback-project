import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Clock, Loader2, Star,
} from 'lucide-react';
import logoMesa from '../assets/logo-mesa.png';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getProfile, getAllProfiles, type Profile } from '../services/profiles';
import {
  getFinalEvaluation,
  approveFinalEvaluation,
  rejectFinalEvaluation,
  formatPeriodLabel,
  averageScores,
  TECHNICAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES,
  type FinalEvaluation,
  type ApprovalStatus,
} from '../services/finalEvaluations';

const CAREER_LABELS: Record<string, string> = {
  efetivação: 'Efetivação',
  promoção: 'Promoção',
  permanência: 'Permanência',
  desligamento: 'Desligamento',
};

const CAREER_COLORS: Record<string, string> = {
  efetivação: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  promoção: 'bg-blue-50 text-blue-700 border-blue-200',
  permanência: 'bg-amber-50 text-amber-700 border-amber-200',
  desligamento: 'bg-red-50 text-red-700 border-red-200',
};

function ApprovalBadge({ status }: { status?: ApprovalStatus }) {
  if (status === 'approved') {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Aprovado
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
        <XCircle className="w-3 h-3" /> Rejeitado
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
      <Clock className="w-3 h-3" /> Pendente
    </span>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`w-5 h-5 rounded text-xs font-medium flex items-center justify-center ${
              n <= value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {n}
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{value}/5</span>
    </div>
  );
}

type ApprovalRole = 'technical' | 'behavioral' | 'hr';

function getMyApprovalRole(role: string): ApprovalRole | null {
  if (role === 'technical-leader') return 'technical';
  if (role === 'behavioral-leader') return 'behavioral';
  if (role === 'admin') return 'hr';
  return null;
}

function getMyApprovalStatus(evaluation: FinalEvaluation, approvalRole: ApprovalRole): ApprovalStatus {
  if (approvalRole === 'technical') return evaluation.tech_approval_status ?? 'pending';
  if (approvalRole === 'behavioral') return evaluation.behavioral_approval_status ?? 'pending';
  return evaluation.hr_approval_status ?? 'pending';
}

export default function FinalEvaluationReview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userId, profile: currentProfile } = useCurrentUser();

  const [evaluation, setEvaluation] = useState<FinalEvaluation | null>(null);
  const [employee, setEmployee] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiExpanded, setAiExpanded] = useState(false);

  // Approval form
  const [comments, setComments] = useState('');
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    getFinalEvaluation(id)
      .then(async (ev) => {
        setEvaluation(ev);
        const [emp, allProfiles] = await Promise.all([
          getProfile(ev.employee_id),
          getAllProfiles(),
        ]);
        setEmployee(emp);
        setProfiles(allProfiles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const myRole = currentProfile?.role ? getMyApprovalRole(currentProfile.role) : null;
  const myStatus = evaluation && myRole ? getMyApprovalStatus(evaluation, myRole) : null;
  const canApprove =
    myRole !== null &&
    evaluation?.status === 'pending_approval' &&
    myStatus === 'pending';

  const handleApprove = async () => {
    if (!id || !userId || !myRole) return;
    setApproving(true);
    try {
      const updated = await approveFinalEvaluation(id, myRole, userId, comments || undefined);
      setEvaluation(updated);
      setComments('');
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id || !userId || !myRole || !comments.trim()) return;
    setRejecting(true);
    try {
      const updated = await rejectFinalEvaluation(id, myRole, userId, comments);
      setEvaluation(updated);
      setComments('');
      setShowRejectForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setRejecting(false);
    }
  };

  const getApproverName = (approvedById?: string) => {
    if (!approvedById) return null;
    return profiles.find((p) => p.id === approvedById)?.name ?? approvedById;
  };

  const statusLabel: Record<FinalEvaluation['status'], { label: string; color: string }> = {
    draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    pending_approval: { label: 'Aguardando Aprovação', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    published: { label: 'Publicada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  if (loading || !evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const status = statusLabel[evaluation.status];
  const techAvg = averageScores(evaluation.technical_scores);
  const behavAvg = averageScores(evaluation.behavioral_scores);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMesa} alt="Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-lg sm:text-xl text-white">Avaliação Final</h1>
              <p className="text-xs sm:text-sm text-white/60">{currentProfile?.name ?? ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm transition-colors">
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Colaborador</p>
              <p className="text-xl font-medium">{employee?.name ?? evaluation.employee_id}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPeriodLabel(evaluation.period)}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm border ${status.color}`}>
                {status.label}
              </span>
              {evaluation.career_recommendation && (
                <span className={`px-3 py-1 rounded-full text-sm border ${CAREER_COLORS[evaluation.career_recommendation] ?? ''}`}>
                  {CAREER_LABELS[evaluation.career_recommendation]}
                </span>
              )}
            </div>
          </div>

          {/* Score averages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">{techAvg.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Média Técnica</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-purple-600">{behavAvg.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Média Comportamental</p>
            </div>
            <div className="text-center sm:col-span-1 col-span-2">
              <p className="text-2xl font-semibold text-emerald-600">
                {((techAvg + behavAvg) / 2).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Média Geral</p>
            </div>
          </div>
        </div>

        {/* Approval Status */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-medium mb-4">Status de Aprovação</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground uppercase font-medium">Líder Técnico</p>
              <ApprovalBadge status={evaluation.tech_approval_status} />
              {evaluation.tech_approved_by && (
                <p className="text-xs text-muted-foreground">
                  {getApproverName(evaluation.tech_approved_by)}
                  {evaluation.tech_approved_at && (
                    <> — {new Date(evaluation.tech_approved_at).toLocaleDateString('pt-PT')}</>
                  )}
                </p>
              )}
              {evaluation.tech_approval_comments && (
                <p className="text-xs italic text-muted-foreground">"{evaluation.tech_approval_comments}"</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground uppercase font-medium">Líder Comportamental</p>
              <ApprovalBadge status={evaluation.behavioral_approval_status} />
              {evaluation.behavioral_approved_by && (
                <p className="text-xs text-muted-foreground">
                  {getApproverName(evaluation.behavioral_approved_by)}
                  {evaluation.behavioral_approved_at && (
                    <> — {new Date(evaluation.behavioral_approved_at).toLocaleDateString('pt-PT')}</>
                  )}
                </p>
              )}
              {evaluation.behavioral_approval_comments && (
                <p className="text-xs italic text-muted-foreground">"{evaluation.behavioral_approval_comments}"</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground uppercase font-medium">RH / Admin</p>
              <ApprovalBadge status={evaluation.hr_approval_status} />
              {evaluation.hr_approved_by && (
                <p className="text-xs text-muted-foreground">
                  {getApproverName(evaluation.hr_approved_by)}
                  {evaluation.hr_approved_at && (
                    <> — {new Date(evaluation.hr_approved_at).toLocaleDateString('pt-PT')}</>
                  )}
                </p>
              )}
              {evaluation.hr_approval_comments && (
                <p className="text-xs italic text-muted-foreground">"{evaluation.hr_approval_comments}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Technical Scores */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h3 className="font-medium">Competências Técnicas</h3>
          </div>
          <div className="space-y-3 mb-4">
            {TECHNICAL_COMPETENCIES.map((comp) => (
              <div key={comp} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-[130px]">
                  <Star className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-sm">{comp}</span>
                </div>
                <ScoreBar value={evaluation.technical_scores?.[comp] ?? 0} />
              </div>
            ))}
          </div>
          {evaluation.technical_summary && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Resumo Técnico</p>
              <p className="text-sm text-muted-foreground">{evaluation.technical_summary}</p>
            </div>
          )}
        </div>

        {/* Behavioral Scores */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <h3 className="font-medium">Competências Comportamentais</h3>
          </div>
          <div className="space-y-3 mb-4">
            {BEHAVIORAL_COMPETENCIES.map((comp) => (
              <div key={comp} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-[130px]">
                  <Star className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-sm">{comp}</span>
                </div>
                <ScoreBar value={evaluation.behavioral_scores?.[comp] ?? 0} />
              </div>
            ))}
          </div>
          {evaluation.behavioral_summary && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Resumo Comportamental</p>
              <p className="text-sm text-muted-foreground">{evaluation.behavioral_summary}</p>
            </div>
          )}
        </div>

        {/* Overall */}
        {evaluation.overall_recommendation && (
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h3 className="font-medium mb-2">Recomendação Geral</h3>
            <p className="text-sm text-muted-foreground">{evaluation.overall_recommendation}</p>
          </div>
        )}

        {/* AI Insights (collapsible) */}
        {evaluation.ai_insights && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl mb-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setAiExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-violet-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <span className="font-medium text-violet-800">Insights da IA</span>
              </div>
              {aiExpanded ? (
                <ChevronUp className="w-4 h-4 text-violet-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-violet-600" />
              )}
            </button>
            {aiExpanded && (
              <div className="px-6 pb-6 space-y-4">
                {evaluation.ai_insights.positive_evolution.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Evolução Positiva</p>
                    <ul className="space-y-1">
                      {evaluation.ai_insights.positive_evolution.map((item, i) => (
                        <li key={i} className="text-sm text-emerald-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evaluation.ai_insights.recurring_issues.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Pontos Recorrentes</p>
                    <ul className="space-y-1">
                      {evaluation.ai_insights.recurring_issues.map((item, i) => (
                        <li key={i} className="text-sm text-amber-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evaluation.ai_insights.trends.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-violet-700 uppercase mb-1">Tendências</p>
                    <ul className="space-y-1">
                      {evaluation.ai_insights.trends.map((item, i) => (
                        <li key={i} className="text-sm text-violet-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Approval Actions */}
        {canApprove && (
          <div className="bg-white rounded-xl border border-primary/20 p-6 mb-6">
            <h3 className="font-medium mb-4">Sua Aprovação</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Comentários (opcional para aprovação)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Adicione observações se desejar..."
                className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
              />
            </div>
            {!showRejectForm ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="flex items-center gap-2 px-6 py-2.5 border border-red-200 text-red-700 rounded-lg text-sm hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Adicione o motivo da rejeição (obrigatório):
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={rejecting || !comments.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Confirmar Rejeição
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {evaluation.status === 'published' && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Avaliação Publicada</p>
              {evaluation.published_at && (
                <p className="text-xs text-emerald-700">
                  Em {new Date(evaluation.published_at).toLocaleDateString('pt-PT')}. Visível ao colaborador.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="h-12" />
      </div>
    </div>
  );
}
