import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  department: string;
  activeEmployees: number;
}

const mockRoles: Role[] = [
  { id: 'role-1', name: 'Desenvolvedor Frontend', description: 'Desenvolvimento de interfaces web', department: 'Tecnologia', activeEmployees: 23 },
  { id: 'role-2', name: 'Desenvolvedor Backend', description: 'Desenvolvimento de APIs e serviços', department: 'Tecnologia', activeEmployees: 18 },
  { id: 'role-3', name: 'Designer UI/UX', description: 'Design de experiência do usuário', department: 'Design', activeEmployees: 12 },
  { id: 'role-4', name: 'Analista de QA', description: 'Garantia de qualidade de software', department: 'Tecnologia', activeEmployees: 8 },
  { id: 'role-5', name: 'DevOps Engineer', description: 'Infraestrutura e automação', department: 'Tecnologia', activeEmployees: 6 },
];

export default function RoleManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (roleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

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
          <h1 className="text-xl sm:text-2xl">Gestão de Cargos</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Cadastrar, editar e excluir cargos da organização
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por cargo ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Novo Cargo</span>
            </button>
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          {filteredRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-base sm:text-lg font-medium mb-1">{role.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{role.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {role.department}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      {role.activeEmployees} colaboradores
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {/* Edit functionality */}}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredRoles.length === 0 && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhum cargo encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal (simplified for now) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Novo Cargo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Nome do Cargo</label>
                <input type="text" className="w-full px-4 py-2 bg-input-background rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm mb-2">Descrição</label>
                <textarea className="w-full px-4 py-2 bg-input-background rounded-lg border border-border" rows={3} />
              </div>
              <div>
                <label className="block text-sm mb-2">Departamento</label>
                <input type="text" className="w-full px-4 py-2 bg-input-background rounded-lg border border-border" />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
