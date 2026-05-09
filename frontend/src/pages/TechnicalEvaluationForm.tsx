import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TechnicalEvaluationForm() {
  const { projectId, employeeId } = useParams();
  const [month, setMonth] = useState('Jan 2026');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleSave() {
    setLoading(true);
    setSuccess('');
    setTimeout(() => {
      setLoading(false);
      setSuccess('Avaliação técnica salva com sucesso.');
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avaliação Técnica</p>
            <h1 className="text-2xl font-semibold text-slate-950">Avaliação Técnica Mensal</h1>
            <p className="text-sm text-slate-600">Projeto {projectId} • Colaborador {employeeId}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Mês
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option>Jan 2026</option>
                <option>Feb 2026</option>
                <option>Mar 2026</option>
                <option>Apr 2026</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Anexar arquivo (opcional)
              <input type="file" className="w-full rounded-2xl border border-border bg-muted px-3 py-3 text-sm text-slate-900" />
            </label>
          </div>

          <div className="mt-6 space-y-6">
            {[
              { label: 'Destaque Técnico', name: 'technicalHighlight' },
              { label: 'Ponto de Atenção', name: 'attentionPoint' },
              { label: 'Nível de Entrega', name: 'deliveryLevel' },
              { label: 'Aprendizado', name: 'learning' },
              { label: 'Mentoria', name: 'mentorship' },
            ].map((field) => (
              <label key={field.name} className="space-y-2 text-sm font-medium text-slate-700">
                {field.label}
                <textarea className="min-h-[120px] w-full rounded-3xl border border-border bg-muted px-4 py-4 text-sm text-slate-900 outline-none" />
              </label>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/technical-leader')}
              className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {success && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}
        </div>
      </main>
    </div>
  );
}
