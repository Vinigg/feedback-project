import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialRoles = [
  { id: 'r1', name: 'Analista', description: 'Analisa demandas e entrega relatórios.', department: 'Operações', employees: 12 },
  { id: 'r2', name: 'Desenvolvedor', description: 'Desenvolve funcionalidades e correções.', department: 'Tecnologia', employees: 25 },
  { id: 'r3', name: 'Líder Técnico', description: 'Lidera times de engenharia.', department: 'Tecnologia', employees: 6 },
];

export default function RoleManagement() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState(initialRoles);
  const [form, setForm] = useState({ name: '', description: '', department: '' });
  const navigate = useNavigate();

  const filteredRoles = useMemo(
    () => roles.filter((role) => role.name.toLowerCase().includes(search.toLowerCase()) || role.department.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  function handleAddRole() {
    if (!form.name.trim()) return;
    setRoles((current) => [
      ...current,
      {
        id: `r${current.length + 1}`,
        name: form.name,
        description: form.description,
        department: form.department,
        employees: 0,
      },
    ]);
    setForm({ name: '', description: '', department: '' });
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setRoles((current) => current.filter((role) => role.id !== id));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Gestão de Cargos</p>
            <h1 className="text-2xl font-semibold text-slate-950">Role Management</h1>
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
              Novo Cargo
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-6 py-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar cargos..."
              className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <div key={role.id} className="flex flex-col gap-4 rounded-3xl border border-border bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{role.name}</h2>
                  <p className="mt-2 text-sm text-slate-700">{role.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Departamento: {role.department}</p>
                  <p className="text-sm text-muted-foreground">Colaboradores: {role.employees}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-2xl border border-border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Editar</button>
                  <button onClick={() => handleDelete(role.id)} className="rounded-2xl bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90">Excluir</button>
                </div>
              </div>
            ))}
            {filteredRoles.length === 0 && <p className="rounded-3xl border border-border bg-white p-6 text-slate-700">Nenhum cargo encontrado.</p>}
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Adicionar Cargo</h2>
                <p className="mt-2 text-sm text-muted-foreground">Preencha os detalhes do novo cargo.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-sm font-semibold text-slate-700">Fechar</button>
            </div>
            <div className="mt-6 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nome"
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Descrição"
                className="min-h-[120px] w-full rounded-3xl border border-border bg-muted px-4 py-4 text-sm text-slate-900 outline-none"
              />
              <input
                value={form.department}
                onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                placeholder="Departamento"
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="rounded-2xl border border-border bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleAddRole} className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
