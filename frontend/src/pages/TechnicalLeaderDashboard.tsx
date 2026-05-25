import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, User, LogOut, ClipboardCheck } from "lucide-react";
import logoMesa from '../assets/logo-mesa.png';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getProjects } from '../services/projects';
import { getProjectMembers, type ProjectMember } from '../services/projects';
import { getEvaluationsByLeader } from '../services/evaluations';
import { getPendingApprovals, formatPeriodLabel, type FinalEvaluation } from '../services/finalEvaluations';
import { getAllProfiles, type Profile } from '../services/profiles';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'pending';
  lastEvaluation?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  employees: Employee[];
  activeCount: number;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: 'Avaliado',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  in_progress: {
    icon: Clock,
    label: 'Em andamento',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  pending: {
    icon: AlertCircle,
    label: 'Pendente',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  }
};

export default function TechnicalLeaderDashboard() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pendingFinalEvals, setPendingFinalEvals] = useState<FinalEvaluation[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const currentPeriod = new Date().toISOString().slice(0, 7);

    Promise.all([
      getProjects(),
      getEvaluationsByLeader(userId),
      getPendingApprovals('technical'),
      getAllProfiles(),
    ])
      .then(async ([projectsData, leaderEvals, pendingEvals, allProfiles]) => {
        setPendingFinalEvals(pendingEvals);
        setPendingProfiles(allProfiles);
        const enriched = await Promise.all(
          projectsData.map(async (proj) => {
            const members = await getProjectMembers(proj.id);
            const employees: Employee[] = members.map((member) => {
              const profile = (member as ProjectMember & { profiles?: Profile }).profiles;
              const hasEval = leaderEvals.some(
                (e) =>
                  e.employee_id === member.employee_id &&
                  e.project_id === proj.id &&
                  e.evaluation_type === 'technical' &&
                  e.period === currentPeriod
              );
              const lastEval = leaderEvals
                .filter(
                  (e) =>
                    e.employee_id === member.employee_id &&
                    e.project_id === proj.id &&
                    e.evaluation_type === 'technical'
                )
                .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))[0];

              return {
                id: member.employee_id,
                name: profile?.name ?? member.employee_id,
                role: profile?.role ?? member.role ?? 'Colaborador',
                status: hasEval ? ('completed' as const) : ('pending' as const),
                lastEvaluation: lastEval?.created_at?.slice(0, 10),
              };
            });
            return {
              id: proj.id,
              name: proj.name,
              description: proj.description ?? '',
              employees,
              activeCount: employees.length,
            };
          })
        );
        setProjects(enriched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleEvaluate = (projectId: string, employeeId: string) => {
    navigate(`/technical-leader/evaluate/${projectId}/${employeeId}`);
  };

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
            <img src={logoMesa} alt="Logo Mesa" className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg" />
            <div>
              <h1 className="text-lg sm:text-xl text-white">Dashboard do Líder Técnico</h1>
              <p className="text-xs sm:text-sm text-white/60">Avaliação de Performance Técnica</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white/60 hover:text-white transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Projetos Ativos</p>
                <p className="text-2xl sm:text-3xl">{projects.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Avaliações Concluídas</p>
                <p className="text-2xl sm:text-3xl">
                  {projects.reduce((acc, p) => acc + p.employees.filter(e => e.status === 'completed').length, 0)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">Avaliações Pendentes</p>
                <p className="text-2xl sm:text-3xl">
                  {projects.reduce((acc, p) => acc + p.employees.filter(e => e.status === 'pending').length, 0)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-4 text-xl sm:text-2xl">Projetos</h2>
        </div>

        {loading && (
          <div className="text-center py-12 text-muted-foreground">Carregando projetos...</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`bg-white rounded-xl p-4 sm:p-6 border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedProject?.id === project.id ? 'border-primary shadow-lg' : 'border-border'
              }`}
            >
              <h3 className="mb-2 text-base sm:text-lg">{project.name}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.employees.length} colaboradores</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Management */}
        {selectedProject && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 border-b border-border">
              <h3 className="text-base sm:text-lg">Equipe - {selectedProject.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gerenciar avaliações dos colaboradores
              </p>
            </div>

            <div className="divide-y divide-border">
              {selectedProject.employees.map((employee) => {
                const status = statusConfig[employee.status];
                const StatusIcon = status.icon;

                return (
                  <div key={employee.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{employee.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{employee.role}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border ${status.bg} ${status.border}`}>
                          <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.color}`} />
                          <span className={`text-xs sm:text-sm ${status.color}`}>{status.label}</span>
                        </div>

                        <button
                          onClick={() => handleEvaluate(selectedProject.id, employee.id)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base whitespace-nowrap"
                        >
                          {employee.status === 'completed' ? 'Ver Feedback' : 'Feedback Recorrente'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/final-evaluation/new/${employee.id}`); }}
                          className="flex items-center gap-1.5 px-3 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm whitespace-nowrap"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          Av. Final
                        </button>
                      </div>
                    </div>

                    {employee.lastEvaluation && (
                      <div className="ml-0 sm:ml-14 mt-2">
                        <p className="text-xs text-muted-foreground">
                          Última avaliação: {new Date(employee.lastEvaluation).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Pending Final Evaluation Approvals */}
        {pendingFinalEvals.length > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-orange-100/50 border-b border-orange-200 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-orange-600" />
              <h3 className="text-base sm:text-lg text-orange-800">
                Avaliações Finais Pendentes de Aprovação ({pendingFinalEvals.length})
              </h3>
            </div>
            <div className="divide-y divide-orange-200">
              {pendingFinalEvals.map((ev) => {
                const empProfile = pendingProfiles.find((p) => p.id === ev.employee_id);
                return (
                  <div
                    key={ev.id}
                    onClick={() => navigate(`/final-evaluation/${ev.id}/review`)}
                    className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 hover:bg-orange-100/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{empProfile?.name ?? ev.employee_id}</p>
                        <p className="text-xs text-muted-foreground">{formatPeriodLabel(ev.period)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">Revisar →</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
