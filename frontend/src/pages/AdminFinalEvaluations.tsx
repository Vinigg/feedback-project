import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Plus, Search, CheckCircle2, XCircle, Clock, FileText, User,
} from 'lucide-react';
import logoMesa from '../assets/logo-mesa.png';
import { supabase } from '../lib/supabase';
import { getAllFinalEvaluations, formatPeriodLabel, averageScores, getSemestralPeriods, type FinalEvaluation } from '../services/finalEvaluations';
import { getAllProfiles, getProfilesByRole, type Profile } from '../services/profiles';

function ApprovalDot({ status }: { status?: string }) {
  if (status === 'approved') return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />;
  if (status === 'rejected') return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />;
}

const STATUS_LABELS: Record<FinalEvaluation['status'], string> = {
  draft: 'Rascunho',
  pending_approval: 'Aguardando',
  published: 'Publicada',
};

const STATUS_COLORS: Record<FinalEvaluation['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending_approval: 'bg-amber-50 text-amber-700',
  published: 'bg-emerald-50 text-emerald-700',
};

export default function AdminFinalEvaluations() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<FinalEvaluation[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FinalEvaluation['status'] | 'all'>('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const periods = getSemestralPeriods(6);

  // New evaluation employee selection
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');

  useEffect(() => {
    Promise.all([getAllFinalEvaluations(), getAllProfiles(), getProfilesByRole('employee')])
      .then(([evals, allProfiles, emps]) => {
        setEvaluations(evals);
        setProfiles(allProfiles);
        setEmployees(emps);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const getEmployeeName = (employeeId: string) =>
    profiles.find((p) => p.id === employeeId)?.name ?? employeeId;

  const filtered = evaluations.filter((ev) => {
    const name = getEmployeeName(ev.employee_id).toLowerCase();
    if (searchTerm && !name.includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false;
    if (periodFilter !== 'all' && ev.period !== periodFilter) return false;
    return true;
  });

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const pendingCount = evaluations.filter((e) => e.status === 'pending_approval').length;
  const publishedCount = evaluations.filter((e) => e.status === 'published').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMesa} alt="Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-lg sm:text-xl text-white">Avaliações Finais</h1>
              <p className="text-xs sm:text-sm text-white/60">Gestão de avaliações consolidadas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Painel
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-3xl font-semibold">{evaluations.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-amber-200">
            <p className="text-sm text-muted-foreground mb-1">Aguardando Aprovação</p>
            <p className="text-3xl font-semibold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-emerald-200">
            <p className="text-sm text-muted-foreground mb-1">Publicadas</p>
            <p className="text-3xl font-semibold text-emerald-600">{publishedCount}</p>
          </div>
        </div>

        {/* Filters + New Button */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FinalEvaluation['status'] | 'all')}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="pending_approval">Aguardando</option>
              <option value="published">Publicada</option>
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos os Períodos</option>
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nova Avaliação
            </button>
          </div>
        </div>

        {/* New Evaluation Employee Picker */}
        {showNewForm && (
          <div className="bg-white rounded-xl border border-primary/20 p-5 mb-6">
            <h3 className="font-medium mb-3">Selecionar Colaborador</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
              {filteredEmployees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => setSelectedEmployeeId(emp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors ${
                    selectedEmployeeId === emp.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.email}</p>
                  </div>
                </button>
              ))}
              {filteredEmployees.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nenhum colaborador encontrado
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                disabled={!selectedEmployeeId}
                onClick={() => navigate(`/final-evaluation/new/${selectedEmployeeId}`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Iniciar Avaliação Final
              </button>
              <button
                type="button"
                onClick={() => { setShowNewForm(false); setSelectedEmployeeId(''); setEmployeeSearch(''); }}
                className="px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-medium">
              {filtered.length} avaliação{filtered.length !== 1 ? 'ões' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Nenhuma avaliação final encontrada
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((ev) => {
                const techAvg = averageScores(ev.technical_scores);
                const behavAvg = averageScores(ev.behavioral_scores);
                return (
                  <div
                    key={ev.id}
                    onClick={() => navigate(`/final-evaluation/${ev.id}/review`)}
                    className="px-6 py-4 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{getEmployeeName(ev.employee_id)}</p>
                          <p className="text-xs text-muted-foreground">{formatPeriodLabel(ev.period)}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 ml-12 sm:ml-0">
                        {/* Status */}
                        <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[ev.status]}`}>
                          {STATUS_LABELS[ev.status]}
                        </span>

                        {/* Scores */}
                        {(techAvg > 0 || behavAvg > 0) && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="text-blue-600 font-medium">{techAvg.toFixed(1)}</span>
                            <span>/</span>
                            <span className="text-purple-600 font-medium">{behavAvg.toFixed(1)}</span>
                          </div>
                        )}

                        {/* Approval dots */}
                        {ev.status !== 'draft' && (
                          <div className="flex items-center gap-1.5" title="Técnico / Comportamental / RH">
                            <ApprovalDot status={ev.tech_approval_status} />
                            <ApprovalDot status={ev.behavioral_approval_status} />
                            <ApprovalDot status={ev.hr_approval_status} />
                          </div>
                        )}

                        {/* Career recommendation */}
                        {ev.career_recommendation && (
                          <span className="text-xs text-muted-foreground capitalize">
                            {ev.career_recommendation}
                          </span>
                        )}

                        {/* Created at */}
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {ev.created_at ? new Date(ev.created_at).toLocaleDateString('pt-PT') : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>Aprovações (técnico / comportamental / RH):</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Aprovado</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Pendente</span>
          <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Rejeitado</span>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
