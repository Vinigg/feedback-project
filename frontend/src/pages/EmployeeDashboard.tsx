import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, TrendingUp, Award, LogOut, History, Bell, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getPublishedFinalEvaluations, formatPeriodLabel, averageScores, TECHNICAL_COMPETENCIES, BEHAVIORAL_COMPETENCIES, type FinalEvaluation } from '../services/finalEvaluations';
import { getMyProjects, type Project } from '../services/projects';

const CAREER_COLORS: Record<string, string> = {
  efetivação: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  promoção: 'bg-blue-50 text-blue-700 border-blue-200',
  permanência: 'bg-amber-50 text-amber-700 border-amber-200',
  desligamento: 'bg-red-50 text-red-700 border-red-200',
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { userId, profile, loading: userLoading } = useCurrentUser();

  const [finalEvals, setFinalEvals] = useState<FinalEvaluation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getPublishedFinalEvaluations(userId),
      getMyProjects(userId),
    ])
      .then(([evals, myProjects]) => {
        setFinalEvals(evals);
        setProjects(myProjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const latestEval = finalEvals[0];
  const latestTechScores = latestEval?.technical_scores ?? {};
  const latestBehavScores = latestEval?.behavioral_scores ?? {};

  // Bar chart data from the latest evaluation scores
  const chartData = [
    ...TECHNICAL_COMPETENCIES.map((c) => ({
      name: c.slice(0, 5),
      score: latestTechScores[c] ?? 0,
      fill: '#3b82f6',
    })),
    ...BEHAVIORAL_COMPETENCIES.map((c) => ({
      name: c.slice(0, 5),
      score: latestBehavScores[c] ?? 0,
      fill: '#8b5cf6',
    })),
  ];

  const newEvalsCount = finalEvals.filter((e) => {
    if (!e.published_at) return false;
    const pub = new Date(e.published_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return pub > weekAgo;
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
              {newEvalsCount > 0 && (
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
        {newEvalsCount > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nova Avaliação Final Disponível</p>
                <p className="text-sm text-muted-foreground">
                  Você tem {newEvalsCount} nova(s) avaliação(ões) final(is) publicada(s) recentemente
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
              <p className="text-muted-foreground">Avaliações Finais</p>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl mb-1">{isReady ? finalEvals.length : '—'}</p>
            <p className="text-sm text-muted-foreground">Total publicadas</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Última Avaliação</p>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-base font-medium mb-1">
              {isReady && latestEval ? formatPeriodLabel(latestEval.period) : '—'}
            </p>
            {isReady && latestEval?.career_recommendation && (
              <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${CAREER_COLORS[latestEval.career_recommendation] ?? ''}`}>
                {latestEval.career_recommendation}
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Média Técnica</p>
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl mb-1 text-blue-600">
              {isReady && latestEval ? averageScores(latestEval.technical_scores).toFixed(1) : '—'}
            </p>
            <p className="text-sm text-muted-foreground">Última avaliação</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Média Comportamental</p>
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl mb-1 text-purple-600">
              {isReady && latestEval ? averageScores(latestEval.behavioral_scores).toFixed(1) : '—'}
            </p>
            <p className="text-sm text-muted-foreground">Última avaliação</p>
          </div>
        </div>
        {/* Competency Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <h3 className="mb-4 text-base sm:text-lg">Scores da Última Avaliação Final</h3>
            {isReady && latestEval ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} stroke="#888" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}/5`, 'Score']} />
                  <Bar dataKey="score" fill="#030213" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                {isReady ? 'Nenhuma avaliação final publicada ainda' : 'Carregando...'}
              </div>
            )}
          </div>

          {/* Meus Projetos */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
              <h3 className="text-base sm:text-lg">Meus Projetos</h3>
            </div>
            <div className="divide-y divide-border max-h-[240px] overflow-y-auto">
              {!isReady && (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">Carregando...</div>
              )}
              {isReady && projects.length === 0 && (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">Nenhum projeto encontrado</div>
              )}
              {projects.map((project) => (
                <div key={project.id} className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2 hover:bg-muted/30 transition-colors">
                  <p className="font-medium text-sm">{project.name}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${
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
        </div>

        {/* Final Evaluations Timeline */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg">Avaliações Finais Recentes</h3>
            <button
              onClick={() => navigate('/employee/history')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
            >
              <History className="w-4 h-4" />
              Ver Histórico Completo
            </button>
          </div>
          <div className="p-4 sm:p-6">
            {!isReady && (
              <p className="text-center text-muted-foreground text-sm py-8">Carregando...</p>
            )}
            {isReady && finalEvals.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">
                Nenhuma avaliação final publicada ainda
              </p>
            )}
            <div className="space-y-3">
              {finalEvals.slice(0, 3).map((ev) => {
                const techAvg = averageScores(ev.technical_scores);
                const behavAvg = averageScores(ev.behavioral_scores);
                return (
                  <div key={ev.id} className="bg-muted/20 rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{formatPeriodLabel(ev.period)}</span>
                        {ev.career_recommendation && (
                          <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${CAREER_COLORS[ev.career_recommendation] ?? ''}`}>
                            {ev.career_recommendation}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="text-blue-600 font-medium">{techAvg.toFixed(1)}</span>
                        <span>/</span>
                        <span className="text-purple-600 font-medium">{behavAvg.toFixed(1)}</span>
                      </div>
                    </div>
                    {ev.overall_recommendation && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{ev.overall_recommendation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}

