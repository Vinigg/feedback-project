import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialQuestions = [
  { id: 'q1', category: 'Técnica', text: 'Como você avalia a qualidade do código entregue?', role: 'Desenvolvedor' },
  { id: 'q2', category: 'Comportamental', text: 'Como você lida com feedbacks durante o trabalho?', role: 'Analista' },
  { id: 'q3', category: 'Técnica', text: 'Descreva um problema complexo que você resolveu recentemente.', role: 'Líder Técnico' },
  { id: 'q4', category: 'Comportamental', text: 'Como você ajuda o time a manter a colaboração?', role: 'Desenvolvedor' },
];

export default function QuestionConfiguration() {
  const [activeTab, setActiveTab] = useState<'Técnica' | 'Comportamental'>('Técnica');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [form, setForm] = useState({ text: '', category: 'Técnica', role: '' });
  const navigate = useNavigate();

  const filteredQuestions = useMemo(
    () => questions.filter((question) => question.category === activeTab && question.text.toLowerCase().includes(search.toLowerCase())),
    [activeTab, questions, search]
  );

  function handleAddQuestion() {
    if (!form.text.trim()) return;
    setQuestions((current) => [
      ...current,
      { id: `q${current.length + 1}`, category: form.category, text: form.text, role: form.role || 'Geral' },
    ]);
    setForm({ text: '', category: activeTab, role: '' });
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Configuração de Perguntas</p>
            <h1 className="text-2xl font-semibold text-slate-950">Question Configuration</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="rounded-2xl border border-border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Nova Pergunta
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-6 py-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 rounded-3xl border border-border bg-muted p-1">
              {(['Técnica', 'Comportamental'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-3xl px-4 py-2 text-sm font-semibold ${activeTab === tab ? 'bg-white text-slate-950' : 'text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar perguntas..."
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none sm:w-80"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">{question.category}</p>
              <p className="mt-4 text-sm text-slate-700">{question.text}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Cargo: {question.role}</p>
            </div>
          ))}
          {filteredQuestions.length === 0 && <p className="rounded-3xl border border-border bg-white p-6 text-slate-700">Nenhuma pergunta encontrada.</p>}
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Adicionar Pergunta</h2>
                <p className="mt-2 text-sm text-muted-foreground">Crie uma nova pergunta para avaliação.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-sm font-semibold text-slate-700">Fechar</button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Pergunta
                <textarea
                  value={form.text}
                  onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
                  className="min-h-[120px] w-full rounded-3xl border border-border bg-muted px-4 py-4 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Categoria
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option>Técnica</option>
                  <option>Comportamental</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Cargo (opcional)
                <input
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                  placeholder="Cargo específico"
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="rounded-2xl border border-border bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleAddQuestion} className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
