import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const lineData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 81 },
  { month: 'Apr', score: 85 },
];

const radarData = [
  { subject: 'Comunicação', value: 80 },
  { subject: 'Proatividade', value: 76 },
  { subject: 'Qualidade', value: 84 },
  { subject: 'Colaboração', value: 72 },
  { subject: 'Aprendizado', value: 88 },
];

const projects = [
  { name: 'Projeto Apollo', status: 'Ativo' },
  { name: 'Sistema Mercury', status: 'Concluído' },
  { name: 'Plataforma Atlas', status: 'Ativo' },
];

const timeline = [
  { type: 'technical', title: 'Avaliação Técnica', description: 'Entrega sólida e consistente.', date: '02 Abr 2026' },
  { type: 'behavioral', title: 'Avaliação Comportamental', description: 'Excelente comunicação com a equipe.', date: '28 Mar 2026' },
  { type: 'technical', title: 'Avaliação Técnica', description: 'Melhorias na arquitetura do módulo.', date: '14 Mar 2026' },
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo, João Silva</p>
            <h1 className="text-2xl font-semibold text-slate-950">Painel do Colaborador</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-border bg-white px-4 py-2 text-sm text-slate-700">Notificações</button>
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
          <div className="flex flex-col gap-4 rounded-3xl bg-blue-50 p-5 text-slate-950 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Novas avaliações disponíveis</p>
              <p className="mt-2 text-base text-slate-700">Verifique seu histórico e acompanhe o desempenho.</p>
            </div>
            <button
              onClick={() => navigate('/employee/history')}
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ver histórico
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Média Geral</p>
            <p className="mt-4 text-3xl font-semibold">84</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Avaliações</p>
            <p className="mt-4 text-3xl font-semibold">24</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Projetos Ativos</p>
            <p className="mt-4 text-3xl font-semibold">2</p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Ponto Forte</p>
            <p className="mt-4 text-3xl font-semibold">Aprendizado</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Evolução Mensal</p>
              <p className="text-sm font-semibold text-slate-900">Últimos 4 meses</p>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Competências</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={100}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Pontuação" dataKey="value" stroke="#7C3AED" fill="#A78BFA" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Projetos</h2>
              <span className="text-sm text-muted-foreground">Em andamento e concluídos</span>
            </div>
            <div className="mt-6 space-y-4">
              {projects.map((project) => (
                <div key={project.name} className="rounded-3xl border border-border bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-950">{project.name}</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Feedbacks Recentes</h2>
              <button
                onClick={() => navigate('/employee/history')}
                className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Ver histórico
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={`${item.type}-${index}`}
                  className={`rounded-3xl border p-4 ${item.type === 'technical' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}
                >
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
