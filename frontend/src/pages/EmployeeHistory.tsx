import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, Award, TrendingUp, FileText, Filter, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  getPublishedFinalEvaluations,
  formatPeriodLabel,
  averageScores,
  TECHNICAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES,
  type FinalEvaluation,
} from '../services/finalEvaluations';

const CAREER_COLORS: Record<string, string> = {
  efetivação: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  promoção: 'bg-blue-50 text-blue-700 border-blue-200',
  permanência: 'bg-amber-50 text-amber-700 border-amber-200',
  desligamento: 'bg-red-50 text-red-700 border-red-200',
};

function ScoreDots({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-4 h-4 rounded text-[10px] font-medium flex items-center justify-center ${
            n <= value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

export default function EmployeeHistory() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  const [allEvaluations, setAllEvaluations] = useState<FinalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [expandedEval, setExpandedEval] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getPublishedFinalEvaluations(userId)
      .then(setAllEvaluations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredEvaluations = allEvaluations.filter((ev) => {
    const period = formatPeriodLabel(ev.period).toLowerCase();
    if (searchTerm && !period.includes(searchTerm.toLowerCase())) return false;
    if (periodFilter && ev.period !== periodFilter) return false;
    return true;
  });

  const latestEval = allEvaluations[0];
  const avgTech = latestEval ? averageScores(latestEval.technical_scores) : 0;
  const avgBehav = latestEval ? averageScores(latestEval.behavioral_scores) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/employee')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-3 sm:mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Histórico de Avaliações Finais</h1>
          <p className="text-white/60 mt-1 text-sm">
            Suas avaliações oficiais de desempenho
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-[88px] z-10 bg-background py-3 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar por período..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos os períodos</option>
                  {Array.from(new Set(allEvaluations.map((e) => e.period))).map((p) => (
                    <option key={p} value={p}>{formatPeriodLabel(p)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {filteredEvaluations.length} avaliação(ões) encontrada(s)
              </p>
              {(searchTerm || periodFilter) && (
                <button
                  onClick={() => { setSearchTerm(''); setPeriodFilter(''); }}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Avaliações Finais</p>
              <p className="text-3xl">{loading ? 'â€”' : allEvaluations.length}</p>
            </div>
            <TrendingUp className="w-7 h-7 text-emerald-500" />
          </div>
          <div className="bg-white rounded-xl p-5 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Média Técnica (última)</p>
              <p className="text-3xl">{loading ? 'â€”' : latestEval ? avgTech.toFixed(1) : 'â€”'}</p>
            </div>
            <Award className="w-7 h-7 text-blue-500" />
          </div>
          <div className="bg-white rounded-xl p-5 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Média Comportamental (última)</p>
              <p className="text-3xl">{loading ? 'â€”' : latestEval ? avgBehav.toFixed(1) : 'â€”'}</p>
            </div>
            <Star className="w-7 h-7 text-purple-500" />
          </div>
        </div>

        {/* Evaluation List */}
        {loading && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted-foreground text-sm">
            Carregando avaliações...
          </div>
        )}
        {!loading && filteredEvaluations.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {allEvaluations.length === 0
                ? 'Nenhuma avaliação final publicada ainda.'
                : 'Nenhuma avaliação encontrada com os filtros aplicados.'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredEvaluations.map((ev) => {
            const techAvg = averageScores(ev.technical_scores);
            const behavAvg = averageScores(ev.behavioral_scores);
            const isExpanded = expandedEval === ev.id;
            return (
              <div key={ev.id} className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Row header */}
                <div
                  onClick={() => setExpandedEval(isExpanded ? null : ev.id)}
                  className="p-5 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-medium">{formatPeriodLabel(ev.period)}</h3>
                        {ev.career_recommendation && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs border capitalize ${CAREER_COLORS[ev.career_recommendation] ?? ''}`}>
                            {ev.career_recommendation}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-blue-600 font-medium">{techAvg.toFixed(1)}</span>
                          <span className="text-xs">técnico</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-purple-600 font-medium">{behavAvg.toFixed(1)}</span>
                          <span className="text-xs">comportamental</span>
                        </span>
                        {ev.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ev.published_at).toLocaleDateString('pt-PT')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-primary text-sm">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Ocultar' : 'Ver Detalhes'}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/10 p-5 space-y-6">
                    {/* Technical scores */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h4 className="font-medium text-sm">Competências Técnicas</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {TECHNICAL_COMPETENCIES.map((comp) => (
                          <div key={comp} className="flex items-center justify-between gap-3 bg-blue-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-blue-900">{comp}</span>
                            <ScoreDots value={ev.technical_scores?.[comp] ?? 0} />
                          </div>
                        ))}
                      </div>
                      {ev.technical_summary && (
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Resumo Técnico</p>
                          <p className="text-sm text-muted-foreground">{ev.technical_summary}</p>
                        </div>
                      )}
                    </div>

                    {/* Behavioral scores */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <h4 className="font-medium text-sm">Competências Comportamentais</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {BEHAVIORAL_COMPETENCIES.map((comp) => (
                          <div key={comp} className="flex items-center justify-between gap-3 bg-purple-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-purple-900">{comp}</span>
                            <ScoreDots value={ev.behavioral_scores?.[comp] ?? 0} />
                          </div>
                        ))}
                      </div>
                      {ev.behavioral_summary && (
                        <div className="bg-white rounded-lg p-3 border border-purple-200">
                          <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Resumo Comportamental</p>
                          <p className="text-sm text-muted-foreground">{ev.behavioral_summary}</p>
                        </div>
                      )}
                    </div>

                    {/* Overall recommendation */}
                    {ev.overall_recommendation && (
                      <div className="bg-white rounded-lg p-3 border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Recomendação Geral</p>
                        <p className="text-sm text-muted-foreground">{ev.overall_recommendation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="h-12" />
      </div>
    </div>
  );
}
