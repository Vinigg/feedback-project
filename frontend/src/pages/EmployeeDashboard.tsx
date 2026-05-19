import { useNavigate } from "react-router-dom";
import { User, TrendingUp, Award, AlertCircle, LogOut, History, Bell, ThumbsUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { supabase } from '../lib/supabase';

const performanceData = [
  { id: 'perf-1', month: 'Jan', score: 3.2 },
  { id: 'perf-2', month: 'Fev', score: 3.5 },
  { id: 'perf-3', month: 'Mar', score: 3.8 },
  { id: 'perf-4', month: 'Abr', score: 3.6 },
];

const skillsData = [
  { id: 'skill-1', skill: 'Velocidade', value: 3.8 },
  { id: 'skill-2', skill: 'Qualidade', value: 4.0 },
  { id: 'skill-3', skill: 'Iniciativa', value: 3.5 },
  { id: 'skill-4', skill: 'Comunicação', value: 3.9 },
  { id: 'skill-5', skill: 'Proatividade', value: 3.6 },
];

const recentFeedbacks = [
  {
    id: 1,
    project: 'Plataforma Web',
    date: '2026-04-01',
    score: 3.8,
    technicalLeader: 'Carlos Mendes',
    behavioralLeader: 'Ana Silva (RH)',
    technicalStrengths: ['Qualidade de Código', 'Resolução de Problemas'],
    behavioralStrengths: ['Comunicação Clara', 'Trabalho em Equipe'],
    technicalImprovements: ['Documentação Técnica'],
    behavioralImprovements: ['Iniciativa'],
    technicalHighlight: 'Excelente qualidade técnica no código',
    behavioralHighlight: 'Ótima colaboração com a equipe'
  },
  {
    id: 2,
    project: 'App Mobile',
    date: '2026-03-15',
    score: 3.5,
    technicalLeader: 'Miguel Santos',
    technicalStrengths: ['Adaptabilidade', 'Qualidade de Código'],
    technicalImprovements: ['Performance'],
    technicalHighlight: 'Boa adaptação às tecnologias mobile'
  },
  {
    id: 3,
    project: 'API Gateway',
    date: '2026-03-01',
    score: 4.0,
    behavioralLeader: 'Rita Sousa (RH)',
    behavioralStrengths: ['Liderança', 'Autonomia', 'Resiliência'],
    behavioralImprovements: [],
    behavioralHighlight: 'Performance excepcional, referência para a equipe'
  }
];

const projects = [
  { id: 'proj-1', name: 'Plataforma Web', role: 'Frontend Developer', status: 'active' },
  { id: 'proj-2', name: 'App Mobile', role: 'React Native', status: 'active' },
  { id: 'proj-3', name: 'API Gateway', role: 'Contributor', status: 'completed' }
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const averageScore = 3.7;
  const newNotifications = 2;

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

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
              <p className="text-xs sm:text-sm text-white/60">João Silva - Frontend Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {newNotifications > 0 && (
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
        {newNotifications > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Novas Avaliações Disponíveis</p>
                <p className="text-sm text-muted-foreground">
                  Você tem {newNotifications} nova(s) avaliação(ões) para visualizar
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
              <p className="text-muted-foreground">Média Geral</p>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl mb-1">{averageScore.toFixed(1)}</p>
            <p className="text-sm text-emerald-600">+0.3 vs mês anterior</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Avaliações</p>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl mb-1">{recentFeedbacks.length}</p>
            <p className="text-sm text-muted-foreground">Últimos 3 meses</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Projetos Ativos</p>
              <User className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl mb-1">{projects.filter(p => p.status === 'active').length}</p>
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Ponto Forte</p>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-lg mb-1">Qualidade</p>
            <p className="text-sm text-muted-foreground">Score: 4.0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <h3 className="mb-4 text-base sm:text-lg">Evolução de Desempenho</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis domain={[0, 4]} stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#030213" strokeWidth={2} dot={{ fill: '#030213', r: 4 }} />
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
            <div className="space-y-4 sm:space-y-6">
              {recentFeedbacks.map((feedback, idx) => (
                <div key={feedback.id} className="relative pl-6 sm:pl-8">
                  {/* Timeline Line */}
                  {idx !== recentFeedbacks.length - 1 && (
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
                        <div className="flex items-center gap-1 mb-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="font-medium">{feedback.score.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString('pt-PT')}
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
