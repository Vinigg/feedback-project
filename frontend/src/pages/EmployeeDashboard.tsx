import { useNavigate } from "react-router-dom";
import { User, TrendingUp, Award, LogOut, History, Bell, ThumbsUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl">Dashboard Pessoal</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">João Silva - Frontend Developer</p>
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
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
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
              <ThumbsUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg mb-1">Qualidade</p>
            <p className="text-sm text-muted-foreground">Código destacado</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Evolução Mensal</h2>
              <span className="text-sm text-muted-foreground">Últimos 4 meses</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Competências</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis />
                <Radar name="Pontuação" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects and Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Projetos Ativos</h2>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status === 'active' ? 'Ativo' : 'Concluído'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Feedbacks Recentes</h2>
              <button
                onClick={() => navigate('/employee/history')}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <History className="w-4 h-4" />
                Ver histórico
              </button>
            </div>
            <div className="space-y-3">
              {recentFeedbacks.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{feedback.project}</p>
                    <span className="text-sm font-semibold text-primary">{feedback.score.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(feedback.date).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
