import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, Award, TrendingUp, FileText, Filter, ThumbsUp, AlertTriangle } from "lucide-react";

interface Evaluation {
  id: string;
  project: string;
  date: string;
  technicalLeader?: string;
  behavioralLeader?: string;
  metrics?: {
    velocidade: number;
    bugs: number;
    volume: number;
    clareza: number;
  };
  softSkills?: {
    iniciativa: number;
    proatividade: number;
    comunicacao: number;
  };
  technicalStrengths?: string[];
  technicalImprovements?: string[];
  behavioralStrengths?: string[];
  behavioralImprovements?: string[];
  technicalFeedback?: string;
  behavioralFeedback?: string;
  overallScore: number;
}

const mockEvaluations: Evaluation[] = [
  {
    id: 'eval-1',
    project: 'Plataforma Web',
    date: '2026-04-01',
    technicalLeader: 'Carlos Mendes',
    behavioralLeader: 'Ana Silva (RH)',
    metrics: { velocidade: 4, bugs: 3, volume: 4, clareza: 4 },
    softSkills: { iniciativa: 3, proatividade: 4, comunicacao: 4 },
    technicalStrengths: ['Qualidade de Código', 'Resolução de Problemas', 'Arquitetura de Software'],
    technicalImprovements: ['Documentação Técnica', 'Testes Unitários'],
    behavioralStrengths: ['Comunicação Clara', 'Trabalho em Equipe', 'Colaboração'],
    behavioralImprovements: ['Iniciativa', 'Proatividade'],
    technicalFeedback: 'Excelente trabalho na implementação das novas features do painel de controlo. O código entregue apresenta alta qualidade, com boas práticas e arquitetura bem pensada. Recomendo focar em melhorar a documentação técnica das soluções implementadas e aumentar a cobertura de testes unitários.',
    behavioralFeedback: 'A comunicação com a equipe tem sido exemplar, sempre disponível para ajudar colegas e compartilhar conhecimento. Demonstra excelente capacidade de trabalho em equipe. Recomendo focar em aumentar a proatividade e iniciativa na identificação de problemas antes que se tornem críticos.',
    overallScore: 3.8
  },
  {
    id: 'eval-2',
    project: 'App Mobile',
    date: '2026-03-15',
    technicalLeader: 'Miguel Santos',
    metrics: { velocidade: 3, bugs: 4, volume: 3, clareza: 4 },
    technicalStrengths: ['Qualidade de Código', 'Adaptabilidade'],
    technicalImprovements: ['Gestão de Débito Técnico', 'Performance e Otimização'],
    technicalFeedback: 'Demonstrou boa adaptação às tecnologias mobile (React Native), considerando que era a primeira vez trabalhando nesta stack. A qualidade das entregas está acima da média, com código limpo e bem estruturado. Recomendo focar em melhorar aspectos de performance e otimização das aplicações móveis.',
    overallScore: 3.5
  },
];

const projects = ['Todos', 'Plataforma Web', 'App Mobile', 'API Gateway', 'Dashboard Analytics'];

export default function EmployeeHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedEval, setExpandedEval] = useState<string | null>(null);

  const filteredEvaluations = mockEvaluations.filter((item) => {
    const matchesSearch = item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technicalLeader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.behavioralLeader?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'Todos' || item.project === selectedProject;
    const matchesDate = !dateFilter || item.date.startsWith(dateFilter);

    return matchesSearch && matchesProject && matchesDate;
  });

  const getScoreColor = (score: number) => {
    if (score >= 3.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 2.5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/employee')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl">Histórico de Avaliações</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
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
                  {projects.map(project => (
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
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Média Geral</p>
                <p className="text-2xl sm:text-3xl">
                  {(filteredEvaluations.reduce((acc, e) => acc + e.overallScore, 0) / filteredEvaluations.length).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Melhor Avaliação</p>
                <p className="text-2xl sm:text-3xl">
                  {Math.max(...filteredEvaluations.map(e => e.overallScore)).toFixed(1)}
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
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm border ${getScoreColor(evaluation.overallScore)} self-start`}>
                        Score: {evaluation.overallScore.toFixed(1)}
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

                        {/* Metrics */}
                        {evaluation.metrics && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Métricas de Desempenho</h5>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                              {Object.entries(evaluation.metrics).map(([key, value]) => (
                                <div key={key} className="bg-white rounded-lg p-2 sm:p-3 border border-blue-300">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {key === 'velocidade' ? 'Velocidade' :
                                     key === 'bugs' ? 'Bugs' :
                                     key === 'volume' ? 'Volume' : 'Clareza'}
                                  </p>
                                  <p className="text-lg sm:text-xl font-semibold">{value.toFixed(1)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

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
