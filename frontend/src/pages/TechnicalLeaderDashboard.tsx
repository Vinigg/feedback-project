import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    id: 'p1',
    name: 'Projeto Apollo',
    employees: [
      { id: 'e1', name: 'Bruna Costa', status: 'completed' },
      { id: 'e2', name: 'Diego Almeida', status: 'in_progress' },
      { id: 'e3', name: 'Lucas Pinto', status: 'pending' },
    ],
  },
  {
    id: 'p2',
    name: 'Sistema Mercury',
    employees: [
      { id: 'e4', name: 'Marcela Souza', status: 'in_progress' },
      { id: 'e5', name: 'Thiago Lima', status: 'pending' },
      { id: 'e6', name: 'Roberta Nunes', status: 'completed' },
    ],
  },
  {
    id: 'p3',
    name: 'Plataforma Atlas',
    employees: [
      { id: 'e7', name: 'Rafael Alves', status: 'completed' },
      { id: 'e8', name: 'Camila Dias', status: 'in_progress' },
      { id: 'e9', name: 'Paulo Vieira', status: 'pending' },
    ],
  },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-700',
};

export default function TechnicalLeaderDashboard() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Líder Técnico</p>
            <h1 className="text-2xl font-semibold text-slate-950">Dashboard do Líder Técnico</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="space-y-8 px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Projetos Ativos</p>
            <p className="mt-4 text-3xl font-semibold">3</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Avaliações Concluídas</p>
            <p className="mt-4 text-3xl font-semibold">18</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Avaliações Pendentes</p>
            <p className="mt-4 text-3xl font-semibold">7</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Projetos</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="rounded-3xl border border-border bg-white p-6 text-left shadow-sm transition hover:border-primary"
              >
                <p className="text-sm text-muted-foreground">{project.id.toUpperCase()}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{project.name}</h3>
                <p className="mt-4 text-sm text-slate-600">Equipe: {project.employees.length} colaboradores</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Equipe do projeto</p>
              <h2 className="text-xl font-semibold text-slate-950">{selectedProject.name}</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {selectedProject.employees.map((employee) => (
              <div key={employee.id} className="flex flex-col gap-4 rounded-3xl border border-border bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-950">{employee.name}</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusStyles[employee.status]}`}>
                    {employee.status.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/technical-leader/evaluate/${selectedProject.id}/${employee.id}`)}
                  className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:w-auto"
                >
                  Avaliar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
