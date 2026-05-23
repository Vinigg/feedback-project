import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, User, TrendingUp, Award } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  averageScore: number;
  lastEvaluation: string;
}

const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'João Silva', role: 'Frontend Developer', department: 'Tecnologia', email: 'joao.silva@empresa.com', averageScore: 3.7, lastEvaluation: '2026-04-01' },
  { id: 'emp-2', name: 'Maria Oliveira', role: 'Backend Developer', department: 'Tecnologia', email: 'maria.oliveira@empresa.com', averageScore: 3.9, lastEvaluation: '2026-04-10' },
  { id: 'emp-3', name: 'Pedro Santos', role: 'Designer UI/UX', department: 'Design', email: 'pedro.santos@empresa.com', averageScore: 3.4, lastEvaluation: '2026-03-28' },
  { id: 'emp-4', name: 'Ana Pereira', role: 'Analista de QA', department: 'Tecnologia', email: 'ana.pereira@empresa.com', averageScore: 4.0, lastEvaluation: '2026-04-05' },
  { id: 'emp-5', name: 'Carlos Ribeiro', role: 'DevOps Engineer', department: 'Tecnologia', email: 'carlos.ribeiro@empresa.com', averageScore: 3.6, lastEvaluation: '2026-03-20' },
  { id: 'emp-6', name: 'Fernanda Costa', role: 'Frontend Developer', department: 'Tecnologia', email: 'fernanda.costa@empresa.com', averageScore: 3.2, lastEvaluation: '2026-04-15' },
];

const getScoreColor = (score: number) => {
  if (score >= 3.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 2.5) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-slate-600 bg-slate-50 border-slate-200';
};

export default function AdminEmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Todos');

  const departments = ['Todos', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

  const filtered = mockEmployees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'Todos' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm sm:text-base mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Colaboradores</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Visualize e acesse o perfil de cada colaborador
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Colaboradores</p>
                <p className="text-2xl sm:text-3xl">{mockEmployees.length}</p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Média Geral da Equipe</p>
                <p className="text-2xl sm:text-3xl">
                  {(mockEmployees.reduce((acc, e) => acc + e.averageScore, 0) / mockEmployees.length).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Melhor Média</p>
                <p className="text-2xl sm:text-3xl">
                  {Math.max(...mockEmployees.map(e => e.averageScore)).toFixed(1)}
                </p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome, cargo ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="py-2.5 sm:py-3 px-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            {filtered.length} colaborador(es) encontrado(s)
          </p>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                Nenhum colaborador encontrado.
              </div>
            ) : (
              filtered.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/admin/employees/${emp.id}`)}
                  className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.role} · {emp.department}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getScoreColor(emp.averageScore)}`}>
                      Média: {emp.averageScore.toFixed(1)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Última avaliação: {new Date(emp.lastEvaluation).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
