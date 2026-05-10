import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, User, LogOut } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'in_progress' | 'pending';
  lastEvaluation?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  employees: Employee[];
  activeCount: number;
}

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Plataforma Web',
    description: 'Desenvolvimento da nova plataforma de gestão',
    activeCount: 5,
    employees: [
      { id: 'emp-1', name: 'João Silva', role: 'Frontend Developer', status: 'completed', lastEvaluation: '2026-03-15' },
      { id: 'emp-2', name: 'Maria Santos', role: 'Backend Developer', status: 'in_progress' },
      { id: 'emp-3', name: 'Pedro Costa', role: 'UI/UX Designer', status: 'pending' },
      { id: 'emp-4', name: 'Ana Rodrigues', role: 'QA Engineer', status: 'completed', lastEvaluation: '2026-04-01' },
      { id: 'emp-5', name: 'Carlos Ferreira', role: 'DevOps', status: 'pending' },
    ]
  },
  {
    id: 'proj-2',
    name: 'App Mobile',
    description: 'Aplicação móvel iOS e Android',
    activeCount: 3,
    employees: [
      { id: 'emp-6', name: 'Sofia Almeida', role: 'iOS Developer', status: 'in_progress' },
      { id: 'emp-7', name: 'Miguel Pereira', role: 'Android Developer', status: 'completed', lastEvaluation: '2026-04-05' },
      { id: 'emp-8', name: 'Rita Sousa', role: 'Product Manager', status: 'pending' },
    ]
  },
  {
    id: 'proj-3',
    name: 'API Gateway',
    description: 'Infraestrutura de microserviços',
    activeCount: 4,
    employees: [
      { id: 'emp-9', name: 'Bruno Martins', role: 'Backend Developer', status: 'pending' },
      { id: 'emp-10', name: 'Luísa Gomes', role: 'DevOps Engineer', status: 'in_progress' },
      { id: 'emp-11', name: 'Tiago Oliveira', role: 'Architect', status: 'completed', lastEvaluation: '2026-03-28' },
      { id: 'emp-12', name: 'Beatriz Lopes', role: 'Tech Lead', status: 'pending' },
    ]
  }
];

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEvaluate = (projectId: string, employeeId: string) => {
    navigate(`/technical-leader/evaluate/${projectId}/${employeeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl">Dashboard do Líder Técnico</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Avaliação de Performance Técnica</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
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
                <p className="text-2xl sm:text-3xl">{mockProjects.length}</p>
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
                  {mockProjects.reduce((acc, p) => acc + p.employees.filter(e => e.status === 'completed').length, 0)}
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
                  {mockProjects.reduce((acc, p) => acc + p.employees.filter(e => e.status === 'pending').length, 0)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {mockProjects.map((project) => (
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
                          {employee.status === 'completed' ? 'Ver Avaliação' : 'Avaliar'}
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
      </div>
    </div>
  );
}
