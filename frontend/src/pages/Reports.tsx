import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, Award, Calendar } from "lucide-react";
import { getSummary, getTopPerformers, getDepartmentStats, type SummaryReport, type TopPerformer, type DepartmentStats } from '../services/reports';
import { getSemestralPeriods } from '../services/finalEvaluations';

export default function Reports() {
  const navigate = useNavigate();
  const periodOptions = getSemestralPeriods(4);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0].value);
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSummary(selectedPeriod),
      getTopPerformers(selectedPeriod),
      getDepartmentStats(selectedPeriod),
    ])
      .then(([s, top, dept]) => {
        setSummary(s);
        setTopPerformers(top);
        setDepartmentStats(dept);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2  text-white/60 hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Relatórios de Desempenho</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Análise consolidada de avaliações e métricas da organização
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Period Selection */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <label className="block text-sm mb-2">Período</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl mb-1">{loading ? '—' : summary?.evaluated_employees ?? 0}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Total de Colaboradores Avaliados</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl mb-1">
              {loading ? '—' : summary ? `${summary.average_technical}/4` : '0/4'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Média Técnica Geral</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl mb-1">
              {loading ? '—' : summary ? `${summary.average_behavioral}/4` : '0/4'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Média Comportamental Geral</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl mb-1">
              {loading ? '—' : summary ? `${summary.completion_rate}%` : '0%'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Conclusão</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-border mb-6 sm:mb-8 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 border-b border-border">
            <h2 className="text-base sm:text-lg">Top Colaboradores</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Maiores desempenhos consolidados do período
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm text-muted-foreground">Nome</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm text-muted-foreground">Cargo</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Técnica</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Comportamental</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Média Geral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPerformers.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">Sem dados para este período</td></tr>
                )}
                {topPerformers.map((performer, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-medium text-sm sm:text-base">{performer.name}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">{performer.role}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm border border-blue-200">
                        {performer.technical}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm border border-purple-200">
                        {performer.behavioral}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="px-2 sm:px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium text-xs sm:text-sm border border-emerald-200">
                        {performer.overall}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Stats */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 border-b border-border">
            <h2 className="text-base sm:text-lg">Desempenho por Departamento</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Médias consolidadas por área
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm text-muted-foreground">Departamento</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Colaboradores</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Média Técnica</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Média Comportamental</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-muted-foreground">Média Geral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departmentStats.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">Sem dados para este período</td></tr>
                )}
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-medium text-sm sm:text-base">{dept.department}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground">{dept.employees}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-xs sm:text-sm">{dept.avg_technical}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-xs sm:text-sm">{dept.avg_behavioral}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="font-medium text-xs sm:text-sm">{dept.overall}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
