import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, Award, TrendingUp, FileText, Filter, ThumbsUp, AlertTriangle } from "lucide-react";
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getEvaluationsByEmployee } from '../services/evaluations';
import { getProjects, type Project } from '../services/projects';
import { getAllProfiles, type Profile } from '../services/profiles';

interface Evaluation {
  id: string;
  project: string;
  date: string;
  technicalLeader?: string;
  behavioralLeader?: string;
  technicalFeedback?: string;
  behavioralFeedback?: string;
  technicalStrengths?: string[];
  technicalImprovements?: string[];
  behavioralStrengths?: string[];
  behavioralImprovements?: string[];
  overallScore: number;
}

export default function EmployeeHistory() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  const [allEvaluations, setAllEvaluations] = useState<Evaluation[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedEval, setExpandedEval] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getEvaluationsByEmployee(userId),
      getProjects(),
      getAllProfiles(),
    ])
      .then(([evals, allProjects, allProfiles]) => {
        const projectsById = new Map<string, Project>(allProjects.map((p) => [p.id, p]));
        const profilesById = new Map<string, Profile>(allProfiles.map((p) => [p.id, p]));

        const mapped: Evaluation[] = evals.map((ev) => {
          const answers = (ev.answers as Record<string, string>) ?? {};
          const projectName = ev.project_id
            ? (projectsById.get(ev.project_id)?.name ?? 'Projeto desconhecido')
            : 'Sem projeto';
          const leaderName = ev.leader_id
            ? (profilesById.get(ev.leader_id)?.name ?? 'Líder')
            : undefined;

          const technicalFeedback = ev.evaluation_type === 'technical'
            ? [answers.destaqueTecnico, answers.pontoAtencao, answers.nivelEntrega, answers.aprendizado, answers.mentoria]
                .filter(Boolean).join('\n\n')
            : undefined;
          const behavioralFeedback = ev.evaluation_type === 'behavioral'
            ? [answers.destaqueComportamental, answers.antecipacaoRiscos, answers.apoioColegas, answers.qualidadeComunicacao, answers.iniciativa]
                .filter(Boolean).join('\n\n')
            : undefined;

          return {
            id: ev.id,
            project: projectName,
            date: ev.created_at ?? ev.period,
            technicalLeader: ev.evaluation_type === 'technical' ? leaderName : undefined,
            behavioralLeader: ev.evaluation_type === 'behavioral' ? leaderName : undefined,
            technicalFeedback,
            behavioralFeedback,
            overallScore: 0,
          };
        });

        setAllEvaluations(mapped);
        const names = Array.from(new Set(mapped.map((e) => e.project)));
        setProjectNames(['Todos', ...names]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredEvaluations = allEvaluations.filter((item) => {
    const matchesSearch = item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.technicalLeader?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (item.behavioralLeader?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesProject = selectedProject === 'Todos' || item.project === selectedProject;
    const matchesDate = !dateFilter || item.date.startsWith(dateFilter);

    return matchesSearch && matchesProject && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/employee')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Histórico de Avaliações</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Visualize todas as suas avaliações de desempenho
          </p>
        </div>
      </header>

      {/* Filters - Sticky */}
      <div className="sticky top-[var(--header-height,88px)] z-10 bg-background py-4 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <h3 className="text-base sm:text-lg">Filtros e Pesquisa</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar por projeto ou líder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                />
              </div>

              {/* Project Filter */}
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-sm sm:text-base"
                >
                  {projectNames.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {filteredEvaluations.length} avaliação(ões) encontrada(s)
              </p>
              {(searchTerm || selectedProject !== 'Todos' || dateFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedProject('Todos');
                    setDateFilter('');
                  }}
                  className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Total de Avaliações</p>
                <p className="text-2xl sm:text-3xl">
                  {loading ? '—' : allEvaluations.length}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Técnicas</p>
                <p className="text-2xl sm:text-3xl">
                  {loading ? '—' : allEvaluations.filter(e => e.technicalLeader).length}
                </p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Total de Avaliações</p>
                <p className="text-2xl sm:text-3xl">{filteredEvaluations.length}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Carregando avaliações...</p>
            </div>
          )}
          {!loading && filteredEvaluations.length === 0 && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
            </div>
          )}
          {filteredEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <div
                onClick={() => setExpandedEval(expandedEval === evaluation.id ? null : evaluation.id)}
                className="p-4 sm:p-6 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg">{evaluation.project}</h3>
                      <span className="px-3 py-1 rounded-full text-xs sm:text-sm border bg-slate-50 text-slate-700 border-slate-200 self-start">
                        {evaluation.technicalLeader ? 'Técnica' : 'Comportamental'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {new Date(evaluation.date).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      {evaluation.technicalLeader && evaluation.behavioralLeader && (
                        <span>Avaliação Completa (Técnica + Comportamental)</span>
                      )}
                      {evaluation.technicalLeader && !evaluation.behavioralLeader && (
                        <span>Avaliação Técnica: {evaluation.technicalLeader}</span>
                      )}
                      {evaluation.behavioralLeader && !evaluation.technicalLeader && (
                        <span>Avaliação Comportamental: {evaluation.behavioralLeader}</span>
                      )}
                    </div>
                  </div>

                  <button className="text-primary hover:text-primary/80 text-sm sm:text-base self-end sm:self-auto">
                    {expandedEval === evaluation.id ? 'Ocultar' : 'Ver Detalhes'}
                  </button>
                </div>
              </div>

              {expandedEval === evaluation.id && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-border bg-muted/20">
                  <div className="pt-4 sm:pt-6 space-y-6">

                    {/* Technical Evaluation Section */}
                    {evaluation.technicalLeader && (
                      <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">T</span>
                          </div>
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold">Feedback Técnico</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">por {evaluation.technicalLeader}</p>
                          </div>
                        </div>

                        {/* Technical Strengths */}
                        {evaluation.technicalStrengths && evaluation.technicalStrengths.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="w-4 h-4 text-emerald-600" />
                              <h5 className="text-sm font-medium">Pontos Fortes Técnicos</h5>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {evaluation.technicalStrengths.map((strength, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs border border-emerald-300"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Improvements */}
                        {evaluation.technicalImprovements && evaluation.technicalImprovements.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <h5 className="text-sm font-medium">Pontos de Melhoria Técnicos</h5>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {evaluation.technicalImprovements.map((improvement, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs border border-amber-300"
                                >
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Feedback */}
                        {evaluation.technicalFeedback && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">Análise Técnica</h5>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-300">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {evaluation.technicalFeedback}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Behavioral Evaluation Section */}
                    {evaluation.behavioralLeader && (
                      <div className="bg-purple-50 rounded-xl p-4 sm:p-5 border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">C</span>
                          </div>
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold">Feedback Comportamental</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">por {evaluation.behavioralLeader}</p>
                          </div>
                        </div>

                        {/* Soft Skills */}
                        {evaluation.softSkills && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Soft Skills</h5>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                              {Object.entries(evaluation.softSkills).map(([key, value]) => (
                                <div key={key} className="bg-white rounded-lg p-2 sm:p-3 border border-purple-300">
                                  <p className="text-xs text-muted-foreground mb-1 capitalize">{key}</p>
                                  <p className="text-lg sm:text-xl font-semibold">{value.toFixed(1)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Behavioral Strengths */}
                        {evaluation.behavioralStrengths && evaluation.behavioralStrengths.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="w-4 h-4 text-emerald-600" />
                              <h5 className="text-sm font-medium">Pontos Fortes Comportamentais</h5>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {evaluation.behavioralStrengths.map((strength, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs border border-emerald-300"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Behavioral Improvements */}
                        {evaluation.behavioralImprovements && evaluation.behavioralImprovements.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <h5 className="text-sm font-medium">Pontos de Melhoria Comportamentais</h5>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {evaluation.behavioralImprovements.map((improvement, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs border border-amber-300"
                                >
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Behavioral Feedback */}
                        {evaluation.behavioralFeedback && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">Parecer Comportamental</h5>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-purple-300">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {evaluation.behavioralFeedback}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEvaluations.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de pesquisa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
