import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Engajamento', value: '92%', color: 'bg-sky-500' },
  { label: 'Satisfação', value: '88%', color: 'bg-emerald-500' },
  { label: 'Retenção', value: '95%', color: 'bg-violet-500' },
  { label: 'Eficiência', value: '89%', color: 'bg-amber-500' },
];

const topCollaborators = [
  { name: 'João Silva', role: 'Desenvolvedor', technical: '88', behavioral: '84', average: '86' },
  { name: 'Camila Dias', role: 'Analista', technical: '85', behavioral: '90', average: '88' },
  { name: 'Miguel Santos', role: 'Líder Técnico', technical: '92', behavioral: '86', average: '89' },
];

const departmentPerformance = [
  { department: 'Tecnologia', technical: '88', behavioral: '83' },
  { department: 'Operações', technical: '81', behavioral: '79' },
  { department: 'People', technical: '77', behavioral: '84' },
];

export default function Reports() {
  const [semester, setSemester] = useState('1º Semestre 2026');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Relatórios</p>
            <h1 className="text-2xl font-semibold text-slate-950">Relatórios</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="rounded-2xl border border-border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-6 py-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Período</h2>
            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none md:w-64"
            >
              <option>1º Semestre 2026</option>
              <option>2º Semestre 2026</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
              <div className={`mt-4 h-2 rounded-full ${item.color}`} />
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Top Colaboradores</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-slate-600">
                  <th className="py-4">Nome</th>
                  <th className="py-4">Cargo</th>
                  <th className="py-4">Técnica</th>
                  <th className="py-4">Comportamental</th>
                  <th className="py-4">Média Geral</th>
                </tr>
              </thead>
              <tbody>
                {topCollaborators.map((collaborator) => (
                  <tr key={collaborator.name} className="border-b border-border">
                    <td className="py-4">{collaborator.name}</td>
                    <td className="py-4">{collaborator.role}</td>
                    <td className="py-4">{collaborator.technical}</td>
                    <td className="py-4">{collaborator.behavioral}</td>
                    <td className="py-4">{collaborator.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Desempenho por Departamento</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-slate-600">
                  <th className="py-4">Departamento</th>
                  <th className="py-4">Técnica</th>
                  <th className="py-4">Comportamental</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformance.map((item) => (
                  <tr key={item.department} className="border-b border-border">
                    <td className="py-4">{item.department}</td>
                    <td className="py-4">{item.technical}</td>
                    <td className="py-4">{item.behavioral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
