import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, Award, Calendar } from "lucide-react";

export default function Reports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('semester-1-2026');

  const summaryStats = [
    { label: 'Total de Colaboradores Avaliados', value: '156', icon: Users, color: 'bg-blue-500' },
    { label: 'Média Técnica Geral', value: '3.2/4', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Média Comportamental Geral', value: '3.4/4', icon: Award, color: 'bg-purple-500' },
    { label: 'Taxa de Conclusão', value: '94%', icon: Calendar, color: 'bg-amber-500' },
  ];

  const topPerformers = [
    { name: 'Maria Santos', role: 'Backend Developer', technical: 4.0, behavioral: 3.8, overall: 3.9 },
    { name: 'João Silva', role: 'Frontend Developer', technical: 3.9, behavioral: 3.7, overall: 3.8 },
    { name: 'Ana Rodrigues', role: 'QA Engineer', technical: 3.7, behavioral: 4.0, overall: 3.85 },
    { name: 'Carlos Ferreira', role: 'DevOps', technical: 3.8, behavioral: 3.6, overall: 3.7 },
    { name: 'Sofia Almeida', role: 'iOS Developer', technical: 3.6, behavioral: 3.8, overall: 3.7 },
  ];

  const departmentStats = [
    { department: 'Tecnologia', employees: 67, avgTech: 3.3, avgBehavioral: 3.2, overall: 3.25 },
    { department: 'Design', employees: 23, avgTech: 3.1, avgBehavioral: 3.6, overall: 3.35 },
    { department: 'Produto', employees: 18, avgTech: 3.0, avgBehavioral: 3.5, overall: 3.25 },
    { department: 'QA', employees: 15, avgTech: 3.2, avgBehavioral: 3.4, overall: 3.3 },
    { department: 'DevOps', employees: 12, avgTech: 3.4, avgBehavioral: 3.1, overall: 3.25 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          <h1 className="text-xl sm:text-2xl">Relatórios de Desempenho</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
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
            <option value="semester-1-2026">1º Semestre 2026</option>
            <option value="semester-2-2025">2º Semestre 2025</option>
            <option value="semester-1-2025">1º Semestre 2025</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 sm:p-6 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
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
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="font-medium text-sm sm:text-base">{dept.department}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground">{dept.employees}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-xs sm:text-sm">{dept.avgTech}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-xs sm:text-sm">{dept.avgBehavioral}</span>
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
