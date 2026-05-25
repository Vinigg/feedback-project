import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, User, Users, ClipboardList } from "lucide-react";
import { getProfilesByRole } from '../services/profiles';
import { getSupabaseClient } from '../services/supabaseService';

interface EmployeeEntry {
  id: string;
  name: string;
  email: string;
  evaluationCount: number;
  lastEvaluation: string | null;
}

export default function AdminEmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<EmployeeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const profiles = await getProfilesByRole('employee');
        if (profiles.length === 0) {
          setEmployees([]);
          return;
        }
        const ids = profiles.map((p) => p.id);
        const client = getSupabaseClient();
        const { data: evals } = await client
          .from('evaluations')
          .select('employee_id, created_at')
          .in('employee_id', ids);

        const evalMap = new Map<string, { count: number; lastDate: string | null }>();
        for (const id of ids) evalMap.set(id, { count: 0, lastDate: null });

        if (evals) {
          for (const ev of evals as { employee_id: string; created_at: string }[]) {
            const entry = evalMap.get(ev.employee_id);
            if (entry) {
              entry.count++;
              if (!entry.lastDate || ev.created_at > entry.lastDate) {
                entry.lastDate = ev.created_at;
              }
            }
          }
        }

        setEmployees(
          profiles.map((p) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            evaluationCount: evalMap.get(p.id)?.count ?? 0,
            lastEvaluation: evalMap.get(p.id)?.lastDate ?? null,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvals = employees.reduce((acc, e) => acc + e.evaluationCount, 0);
  const withEvals = employees.filter((e) => e.evaluationCount > 0).length;

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
                <p className="text-2xl sm:text-3xl">{loading ? '—' : employees.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Avaliações</p>
                <p className="text-2xl sm:text-3xl">{loading ? '—' : totalEvals}</p>
              </div>
              <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Com Avaliações</p>
                <p className="text-2xl sm:text-3xl">{loading ? '—' : withEvals}</p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            {loading ? 'Carregando...' : `${filtered.length} colaborador(es) encontrado(s)`}
          </p>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {loading ? (
              <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                Carregando colaboradores...
              </div>
            ) : filtered.length === 0 ? (
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
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className="px-3 py-1 rounded-full text-sm border bg-blue-50 text-blue-700 border-blue-200">
                      {emp.evaluationCount} avaliação(ões)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {emp.lastEvaluation
                        ? `Última: ${new Date(emp.lastEvaluation).toLocaleDateString('pt-PT')}`
                        : 'Sem avaliações'}
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
