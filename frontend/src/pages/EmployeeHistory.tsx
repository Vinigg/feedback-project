import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const evaluations = [
  {
    id: '1',
    project: 'Projeto Apollo',
    month: 'Abr 2026',
    technicalLeader: 'Carlos',
    behavioralLeader: 'Ana',
    technicalScore: 86,
    behavioralScore: 82,
    average: 84,
    technicalNote: 'Entrega excelente e estável.',
    behavioralNote: 'Comunicação clara com o time.',
  },
  {
    id: '2',
    project: 'Sistema Mercury',
    month: 'Mar 2026',
    technicalLeader: 'Miguel',
    behavioralLeader: 'People',
    technicalScore: 80,
    behavioralScore: 78,
    average: 79,
    technicalNote: 'Bom desempenho nos testes.',
    behavioralNote: 'Apoio consistente aos colegas.',
  },
  {
    id: '3',
    project: 'Plataforma Atlas',
    month: 'Fev 2026',
    technicalLeader: 'Tech',
    behavioralLeader: 'Rh',
    technicalScore: 88,
    behavioralScore: 85,
    average: 87,
    technicalNote: 'Liderou melhorias técnicas.',
    behavioralNote: 'Ótima antecipação de riscos.',
  },
];

export default function EmployeeHistory() {
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('Todos');
  const [month, setMonth] = useState('Todos');
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return evaluations.filter((item) => {
      const searchable = `${item.technicalLeader} ${item.behavioralLeader}`.toLowerCase();
      const matchesSearch = search.trim() === '' || searchable.includes(search.toLowerCase());
      const matchesProject = project === 'Todos' || item.project === project;
      const matchesMonth = month === 'Todos' || item.month === month;
      return matchesSearch && matchesProject && matchesMonth;
    });
  }, [search, project, month]);

  const summary = useMemo(() => {
    const average = Number((evaluations.reduce((acc, item) => acc + item.average, 0) / evaluations.length).toFixed(0));
    const best = evaluations.reduce((bestItem, item) => (item.average > bestItem.average ? item : bestItem), evaluations[0]);
    return {
      average,
      best: best.average,
      total: evaluations.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Histórico de Avaliações</p>
            <h1 className="text-2xl font-semibold text-slate-950">Histórico do Colaborador</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/employee')}
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

      <main className="px-6 py-8">
        <div className="sticky top-20 z-10 rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_140px_140px]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Buscar por líder
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Projeto
              <select
                value={project}
                onChange={(event) => setProject(event.target.value)}
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option>Todos</option>
                <option>Projeto Apollo</option>
                <option>Sistema Mercury</option>
                <option>Plataforma Atlas</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Mês
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option>Todos</option>
                <option>Abr 2026</option>
                <option>Mar 2026</option>
                <option>Fev 2026</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Média Geral</p>
            <p className="mt-4 text-3xl font-semibold">{summary.average}</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Melhor Avaliação</p>
            <p className="mt-4 text-3xl font-semibold">{summary.best}</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Total</p>
            <p className="mt-4 text-3xl font-semibold">{summary.total}</p>
          </div>
        </div>

        <section className="mt-8 space-y-4">
          {filtered.map((item) => {
            const isExpanded = expanded === item.id;
            return (
              <div key={item.id} className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                  className="w-full px-6 py-5 text-left"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.project} • {item.month}</p>
                      <h2 className="text-lg font-semibold text-slate-950">{item.technicalLeader} / {item.behavioralLeader}</h2>
                    </div>
                    <div className="flex gap-3 text-sm text-slate-600">
                      <span>Média: {item.average}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{isExpanded ? 'Recolher' : 'Expandir'}</span>
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-border bg-muted px-6 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4">
                        <p className="font-semibold text-slate-950">Avaliação Técnica</p>
                        <p className="mt-3 text-sm text-slate-700">{item.technicalNote}</p>
                      </div>
                      <div className="rounded-3xl border border-purple-200 bg-purple-50 p-4">
                        <p className="font-semibold text-slate-950">Avaliação Comportamental</p>
                        <p className="mt-3 text-sm text-slate-700">{item.behavioralNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="rounded-3xl border border-border bg-white p-6 text-slate-700">Nenhuma avaliação encontrada.</p>}
        </section>
      </main>
    </div>
  );
}
