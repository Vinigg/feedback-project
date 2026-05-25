import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, TrendingUp, Award, ArrowLeft, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getProfile, getAllProfiles, type Profile } from '../services/profiles';
import { getEvaluationsByEmployee, type Evaluation } from '../services/evaluations';
import { getMyProjects } from '../services/projects';
import { getSupabaseClient } from '../services/supabaseService';

interface ProjectEntry {
  id: string;
  name: string;
  roleInProject: string;
  status: string;
}

function getLastNMonths(n: number): { value: string; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      value: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('pt-PT', { month: 'short' }),
    });
  }
  return result;
}

export default function AdminEmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [profileMap, setProfileMap] = useState<Map<string, string>>(new Map());
  const [projectNameMap, setProjectNameMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const [prof, evals, myProjects, allProfiles] = await Promise.all([
          getProfile(id!),
          getEvaluationsByEmployee(id!),
          getMyProjects(id!),
          getAllProfiles(),
        ]);

        const projectIds = myProjects.map((p) => p.id);
        const memberRoles: Record<string, string> = {};
        if (projectIds.length > 0) {
          const client = getSupabaseClient();
          const { data: members } = await client
            .from('project_members')
            .select('project_id, role_in_project')
            .eq('employee_id', id)
            .in('project_id', projectIds);
          if (members) {
            for (const m of members as { project_id: string; role_in_project: string }[]) {
              memberRoles[m.project_id] = m.role_in_project || '—';
            }
          }
        }

        setProfile(prof);
        setEvaluations(evals);
        setProfileMap(new Map(allProfiles.map((p) => [p.id, p.name])));
        setProjectNameMap(new Map(myProjects.map((p) => [p.id, p.name])));
        setProjects(
          myProjects.map((p) => ({
            id: p.id,
            name: p.name,
            roleInProject: memberRoles[p.id] ?? '—',
            status: p.status ?? 'active',
          }))
        );
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Colaborador não encontrado.</p>
          <button
            onClick={() => navigate('/admin/employees')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à Lista
          </button>
        </div>
      </div>
    );
  }

  const months = getLastNMonths(6);
  const performanceData = months.map((m) => ({
    month: m.label,
    avaliações: evaluations.filter((e) => e.period === m.value).length,
  }));

  const technicalCount = evaluations.filter((e) => e.evaluation_type === 'technical').length;
  const behavioralCount = evaluations.filter((e) => e.evaluation_type === 'behavioral').length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl text-white">{profile.name}</h1>
              <p className="text-xs sm:text-sm text-white/60">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/employees')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white/60 hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar à Lista</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Visualização Administrativa</p>
            <p className="text-xs text-amber-700">
              Você está visualizando o perfil de <strong>{profile.name}</strong> como administrador.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Total de Avaliações</p>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl mb-1">{evaluations.length}</p>
            <p className="text-sm text-muted-foreground">Todas as avaliações</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Avaliações por Tipo</p>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl mb-1">{technicalCount} / {behavioralCount}</p>
            <p className="text-sm text-muted-foreground">Técnicas / Comportamentais</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Projetos Ativos</p>
              <User className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl mb-1">{activeProjects}</p>
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-border mb-4 sm:mb-6">
          <h3 className="mb-4 text-base sm:text-lg">Avaliações Recebidas por Mês</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis allowDecimals={false} stroke="#888" />
              <Tooltip />
              <Bar dataKey="avaliações" fill="#030213" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <h3 className="text-base sm:text-lg">Projetos</h3>
          </div>
          <div className="divide-y divide-border">
            {projects.length === 0 ? (
              <p className="px-6 py-8 text-center text-muted-foreground text-sm">Sem projetos vinculados.</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.roleInProject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {project.status === 'active' ? 'Ativo' : 'Concluído'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg">Histórico de Avaliações</h3>
          </div>
          <div className="p-4 sm:p-6">
            {evaluations.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">Nenhuma avaliação encontrada.</p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {evaluations.map((ev, idx) => {
                  const answers = (ev.answers ?? {}) as Record<string, string>;
                  const isTechnical = ev.evaluation_type === 'technical';
                  const leaderName = ev.leader_id ? (profileMap.get(ev.leader_id) ?? 'Desconhecido') : '—';
                  const projectName = ev.project_id ? (projectNameMap.get(ev.project_id) ?? ev.project_id) : '—';

                  return (
                    <div key={ev.id} className="relative pl-6 sm:pl-8">
                      {idx !== evaluations.length - 1 && (
                        <div className="absolute left-1.5 sm:left-2 top-6 sm:top-8 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-2 border-white shadow-sm" />
                      <div className="bg-white rounded-lg p-4 sm:p-5 border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{projectName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {isTechnical ? '📘 Técnico' : '💜 Comportamental'} · {leaderName}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs border flex-shrink-0 ${
                            isTechnical
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {ev.period}
                          </span>
                        </div>

                        {isTechnical ? (
                          <div className="space-y-2 text-sm">
                            {answers.destaqueTecnico && <div><span className="text-xs font-semibold text-blue-700">Destaque Técnico: </span><span className="text-muted-foreground">{answers.destaqueTecnico}</span></div>}
                            {answers.pontoAtencao && <div><span className="text-xs font-semibold text-amber-700">Ponto de Atenção: </span><span className="text-muted-foreground">{answers.pontoAtencao}</span></div>}
                            {answers.nivelEntrega && <div><span className="text-xs font-semibold text-emerald-700">Nível de Entrega: </span><span className="text-muted-foreground">{answers.nivelEntrega}</span></div>}
                            {answers.aprendizado && <div><span className="text-xs font-semibold text-slate-600">Aprendizado: </span><span className="text-muted-foreground">{answers.aprendizado}</span></div>}
                            {answers.mentoria && <div><span className="text-xs font-semibold text-slate-600">Mentoria: </span><span className="text-muted-foreground">{answers.mentoria}</span></div>}
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            {answers.destaqueComportamental && <div><span className="text-xs font-semibold text-purple-700">Destaque Comportamental: </span><span className="text-muted-foreground">{answers.destaqueComportamental}</span></div>}
                            {answers.antecipacaoRiscos && <div><span className="text-xs font-semibold text-amber-700">Antecipação de Riscos: </span><span className="text-muted-foreground">{answers.antecipacaoRiscos}</span></div>}
                            {answers.apoioColegas && <div><span className="text-xs font-semibold text-emerald-700">Apoio a Colegas: </span><span className="text-muted-foreground">{answers.apoioColegas}</span></div>}
                            {answers.qualidadeComunicacao && <div><span className="text-xs font-semibold text-slate-600">Comunicação: </span><span className="text-muted-foreground">{answers.qualidadeComunicacao}</span></div>}
                            {answers.iniciativa && <div><span className="text-xs font-semibold text-slate-600">Iniciativa: </span><span className="text-muted-foreground">{answers.iniciativa}</span></div>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
