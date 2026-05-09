import { useNavigate } from 'react-router-dom';

const cards = [
  { title: 'Gestão de Cargos', description: 'Gerencie cargos e equipes', route: '/admin/roles' },
  { title: 'Configuração de Perguntas', description: 'Personalize as perguntas de avaliação', route: '/admin/questions' },
  { title: 'Relatórios', description: 'Veja resultados e indicadores', route: '/admin/reports' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-lg">⚙️</div>
            <div>
              <p className="text-sm text-muted-foreground">Administração</p>
              <h1 className="text-2xl font-semibold text-slate-950">Painel do Administrador</h1>
            </div>
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
        <div className="rounded-[2rem] bg-gradient-to-r from-violet-500 to-sky-500 p-8 text-white shadow-lg">
          <h2 className="text-3xl font-semibold">Bem-vindo de volta, administrador!</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-100/90">Use o painel para navegar rapidamente entre gestão de cargos, perguntas e relatórios.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="rounded-3xl border border-border bg-white p-6 text-left shadow-sm transition hover:border-primary"
            >
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{card.description}</h3>
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Total de Cargos</p>
            <p className="mt-4 text-3xl font-semibold">8</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Perguntas Ativas</p>
            <p className="mt-4 text-3xl font-semibold">24</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Colaboradores</p>
            <p className="mt-4 text-3xl font-semibold">156</p>
          </div>
        </div>
      </main>
    </div>
  );
}
