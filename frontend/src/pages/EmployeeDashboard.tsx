import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, TrendingUp, Award, AlertCircle, LogOut, History, Bell, ThumbsUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getEvaluationsByEmployee, type Evaluation } from '../services/evaluations';
import { getProjects, type Project } from '../services/projects';
import { getAllProfiles, type Profile } from '../services/profiles';

interface FeedbackDisplay {
  id: string;
  project: string;
  date: string;
  technicalLeader?: string;
  behavioralLeader?: string;
  technicalHighlight?: string;
  behavioralHighlight?: string;
  technicalStrengths?: string[];
  technicalImprovements?: string[];
  behavioralStrengths?: string[];
  behavioralImprovements?: string[];
}

interface ProjectDisplay {
  id: string;
  name: string;
  role: string;
  status: string;
}

const skillsData = [
  { skill: 'Velocidade', value: 0 },
  { skill: 'Qualidade', value: 0 },
  { skill: 'Iniciativa', value: 0 },
  { skill: 'Comunicação', value: 0 },
  { skill: 'Proatividade', value: 0 },
];

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
};

function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { userId, profile, loading: userLoading } = useCurrentUser();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackDisplay[]>([]);
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [performanceData, setPerformanceData] = useState<{ month: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    Promise.all([
      getEvaluationsByEmployee(userId),
      getProjects(),
      getAllProfiles(),
    ])
      .then(([evals, allProjects, allProfiles]) => {
        setEvaluations(evals);

        const projectsById = new Map<string, Project>(allProjects.map((p) => [p.id, p]));
        const profilesById = new Map<string, Profile>(allProfiles.map((p) => [p.id, p]));

        const displayed = evals.slice(0, 5).map((ev): FeedbackDisplay => {
          const answers = (ev.answers as Record<string, string>) ?? {};
          const projectName = ev.project_id
            ? (projectsById.get(ev.project_id)?.name ?? 'Projeto desconhecido')
            : 'Sem projeto';
          const leaderName = ev.leader_id
            ? (profilesById.get(ev.leader_id)?.name ?? 'Líder')
            : undefined;
          return {
            id: ev.id,
            project: projectName,
            date: ev.created_at ?? ev.period,
            technicalLeader: ev.evaluation_type === 'technical' ? leaderName : undefined,
            behavioralLeader: ev.evaluation_type === 'behavioral' ? leaderName : undefined,
            technicalHighlight: ev.evaluation_type === 'technical' ? answers.destaqueTecnico : undefined,
            behavioralHighlight: ev.evaluation_type === 'behavioral' ? answers.destaqueComportamental : undefined,
          };
        });
        setFeedbacks(displayed);

        const seenProjectIds = new Set<string>();
        const projectList: ProjectDisplay[] = [];
        for (const ev of evals) {
          if (ev.project_id && !seenProjectIds.has(ev.project_id)) {
            seenProjectIds.add(ev.project_id);
            const proj = projectsById.get(ev.project_id);
            if (proj) {
              projectList.push({ id: proj.id, name: proj.name, role: '', status: proj.status ?? 'active' });
            }
          }
        }
        setProjects(projectList);

        const last4 = getLastNMonths(4);
        const chartData = last4.map((ym) => {
          const [, month] = ym.split('-');
          return { month: MONTH_LABELS[month] ?? month, score: evals.filter((e) => e.period === ym).length };
        });
        setPerformanceData(chartData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const newEvaluationsCount = evaluations.filter((e) => {
    const created = new Date(e.created_at ?? '');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length;

  const isReady = !userLoading && !loading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl text-white">Dashboard Pessoal</h1>
              <p className="text-xs sm:text-sm text-white/60">
                {profile ? `${profile.name} - ${profile.role}` : 'Carregando...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {newEvaluationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2  text-white/60 hover:text-white transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Notifications Banner */}
        {newEvaluationsCount > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Novas Avaliações Disponíveis</p>
                <p className="text-sm text-muted-foreground">
                  Você tem {newEvaluationsCount} nova(s) avaliação(ões) para visualizar
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/employee/history')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Agora
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Total de Avaliações</p>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl mb-1">{isReady ? evaluations.length : '—'}</p>
            <p className="text-sm text-muted-foreground">Todas as avaliações</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Avaliações Recentes</p>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl mb-1">{isReady ? feedbacks.length : '—'}</p>
            <p className="text-sm text-muted-foreground">Últimas 5 avaliações</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Projetos Ativos</p>
              <User className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl mb-1">{isReady ? projects.filter(p => p.status === 'active').length : '—'}</p>
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Novas (7 dias)</p>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl mb-1">{isReady ? newEvaluationsCount : '—'}</p>
            <p className="text-sm text-muted-foreground">Avaliações recentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <h3 className="mb-4 text-base sm:text-lg">Avaliações por Mês</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis allowDecimals={false} stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="score" name="Avaliações" stroke="#030213" strokeWidth={2} dot={{ fill: '#030213', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skills Radar */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <h3 className="mb-4 text-base sm:text-lg">Análise de Competências</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 4]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="#030213" fill="#030213" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-border mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <h3 className="text-base sm:text-lg">Meus Projetos</h3>
          </div>
          <div className="divide-y divide-border">
            {!isReady && (
              <div className="px-4 sm:px-6 py-6 text-center text-muted-foreground text-sm">Carregando...</div>
            )}
            {isReady && projects.length === 0 && (
              <div className="px-4 sm:px-6 py-6 text-center text-muted-foreground text-sm">Nenhum projeto encontrado</div>
            )}
            {projects.map((project) => (
              <div key={project.id} className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {project.status === 'active' ? 'Ativo' : 'Concluído'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedbacks Timeline */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg">Linha do Tempo - Feedbacks Recentes</h3>
            <button
              onClick={() => navigate('/employee/history')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
            >
              <History className="w-4 h-4" />
              <span>Ver Histórico Completo</span>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {!isReady && (
              <p className="text-center text-muted-foreground text-sm py-8">Carregando avaliações...</p>
            )}
            {isReady && feedbacks.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">Nenhuma avaliação encontrada</p>
            )}
            <div className="space-y-4 sm:space-y-6">
              {feedbacks.map((feedback, idx) => (
                <div key={feedback.id} className="relative pl-6 sm:pl-8">
                  {/* Timeline Line */}
                  {idx !== feedbacks.length - 1 && (
                    <div className="absolute left-1.5 sm:left-2 top-6 sm:top-8 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-2 border-white shadow-sm" />

                  <div className="bg-white rounded-lg p-4 sm:p-5 border border-border shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-base sm:text-lg">{feedback.project}</p>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1 space-y-1">
                          {feedback.technicalLeader && (
                            <p>📘 Técnico: {feedback.technicalLeader}</p>
                          )}
                          {feedback.behavioralLeader && (
                            <p>💜 Comportamental: {feedback.behavioralLeader}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {feedback.date ? new Date(feedback.date).toLocaleDateString('pt-PT') : ''}
                        </p>
                      </div>
                    </div>

                    {/* Technical Feedback */}
                    {feedback.technicalLeader && (
                      <div className="mb-3 pb-3 border-b border-border">
                        <p className="text-xs font-semibold text-blue-700 mb-2">FEEDBACK TÉCNICO</p>
                        {feedback.technicalStrengths && feedback.technicalStrengths.length > 0 && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ThumbsUp className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">Fortes</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {feedback.technicalStrengths.map((strength, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.technicalImprovements && feedback.technicalImprovements.length > 0 && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span className="text-xs font-medium text-amber-700">Melhoria</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {feedback.technicalImprovements.map((improvement, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200"
                                >
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.technicalHighlight && (
                          <p className="text-xs text-muted-foreground italic mt-2">"{feedback.technicalHighlight}"</p>
                        )}
                      </div>
                    )}

                    {/* Behavioral Feedback */}
                    {feedback.behavioralLeader && (
                      <div>
                        <p className="text-xs font-semibold text-purple-700 mb-2">FEEDBACK COMPORTAMENTAL</p>
                        {feedback.behavioralStrengths && feedback.behavioralStrengths.length > 0 && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ThumbsUp className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">Fortes</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {feedback.behavioralStrengths.map((strength, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.behavioralImprovements && feedback.behavioralImprovements.length > 0 && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span className="text-xs font-medium text-amber-700">Melhoria</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {feedback.behavioralImprovements.map((improvement, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200"
                                >
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.behavioralHighlight && (
                          <p className="text-xs text-muted-foreground italic mt-2">"{feedback.behavioralHighlight}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-emerald-900 mb-1 text-sm sm:text-base">Pontos Fortes</h4>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Qualidade do código e comunicação consistentemente acima da média
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-amber-900 mb-1 text-sm sm:text-base">Oportunidades de Melhoria</h4>
                <p className="text-xs sm:text-sm text-amber-700">
                  Aumentar iniciativa e autonomia na resolução de problemas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
