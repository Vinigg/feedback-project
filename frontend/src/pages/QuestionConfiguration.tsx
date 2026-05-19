import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Search, Code, Heart } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  role?: string;
  category: string;
}

const mockQuestions: Question[] = [
  { id: 'q-tech-1', text: 'Como foi a qualidade do código entregue neste mês?', type: 'technical', role: 'Desenvolvedor Frontend', category: 'Qualidade' },
  { id: 'q-tech-2', text: 'O colaborador demonstrou evolução técnica? Quais tecnologias/práticas foram aprendidas?', type: 'technical', role: 'Desenvolvedor Backend', category: 'Aprendizado' },
  { id: 'q-tech-3', text: 'Houve mentoria técnica ou apoio a outros desenvolvedores?', type: 'technical', category: 'Mentoria' },
  { id: 'q-tech-4', text: 'Qual foi o nível de entrega comparado ao esperado?', type: 'technical', category: 'Desempenho' },
  { id: 'q-beh-1', text: 'Como foi a comunicação do colaborador com a equipe?', type: 'behavioral', category: 'Comunicação' },
  { id: 'q-beh-2', text: 'O colaborador antecipou riscos ou problemas no projeto?', type: 'behavioral', category: 'Proatividade' },
  { id: 'q-beh-3', text: 'Como foi o apoio aos colegas de equipe?', type: 'behavioral', category: 'Colaboração' },
  { id: 'q-beh-4', text: 'Houve iniciativas voluntárias ou contribuições além do esperado?', type: 'behavioral', category: 'Iniciativa' },
];

const technicalCategories = ['Qualidade', 'Desempenho', 'Aprendizado', 'Mentoria', 'Arquitetura'];
const behavioralCategories = ['Comunicação', 'Proatividade', 'Colaboração', 'Iniciativa', 'Liderança'];

const mockRoles = [
  'Desenvolvedor Frontend',
  'Desenvolvedor Backend',
  'Designer UI/UX',
  'Analista de QA',
  'DevOps Engineer',
  'Product Manager'
];

export default function QuestionConfiguration() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral'>('technical');
  const [showAddModal, setShowAddModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formData, setFormData] = useState({
    text: '',
    role: '',
    category: ''
  });

  const filteredQuestions = questions.filter(q =>
    q.type === activeTab &&
    (q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
     q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     q.role?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (questionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      role: question.role || '',
      category: question.category
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.text || !formData.category) return;

    if (editingQuestion) {
      setQuestions(questions.map(q =>
        q.id === editingQuestion.id
          ? { ...q, text: formData.text, role: formData.role || undefined, category: formData.category }
          : q
      ));
    } else {
      const newQuestion: Question = {
        id: `q-${activeTab}-${Date.now()}`,
        text: formData.text,
        type: activeTab,
        role: formData.role || undefined,
        category: formData.category
      };
      setQuestions([...questions, newQuestion]);
    }

    setShowAddModal(false);
    setEditingQuestion(null);
    setFormData({ text: '', role: '', category: '' });
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({ text: '', role: '', category: '' });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2  text-white/60 hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Configuração de Perguntas</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Gerenciar perguntas de avaliação técnica e comportamental
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-border mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('technical')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${
                activeTab === 'technical'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'bg-white text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Perguntas Técnicas</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'technical' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'
              }`}>
                {questions.filter(q => q.type === 'technical').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('behavioral')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${
                activeTab === 'behavioral'
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                  : 'bg-white text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Perguntas Comportamentais</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'behavioral' ? 'bg-purple-100 text-purple-700' : 'bg-muted text-muted-foreground'
              }`}>
                {questions.filter(q => q.type === 'behavioral').length}
              </span>
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por pergunta, categoria ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={openAddModal}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg hover:opacity-90 transition-colors ${
                activeTab === 'technical' ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nova Pergunta</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className={`bg-white rounded-xl border-2 p-4 sm:p-6 hover:shadow-md transition-shadow ${
              activeTab === 'technical' ? 'border-blue-100' : 'border-purple-100'
            }`}>
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <p className="text-sm sm:text-base mb-3">{question.text}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full border text-xs sm:text-sm ${
                      activeTab === 'technical'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {question.category}
                    </span>
                    {question.role && (
                      <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full border border-slate-200 text-xs sm:text-sm">
                        {question.role}
                      </span>
                    )}
                    {!question.role && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs sm:text-sm">
                        Todos os cargos
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhuma pergunta encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
              {activeTab === 'technical' ? ' Técnica' : ' Comportamental'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Texto da Pergunta</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Digite a pergunta que será usada nas avaliações mensais..."
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border min-h-[100px] resize-y text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border text-sm"
                >
                  <option value="">Selecione uma categoria</option>
                  {(activeTab === 'technical' ? technicalCategories : behavioralCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Cargo Específico <span className="text-muted-foreground">(opcional)</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border text-sm"
                >
                  <option value="">Todos os cargos</option>
                  {mockRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Se não selecionar, a pergunta aparecerá para todos os cargos
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingQuestion(null);
                    setFormData({ text: '', role: '', category: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.text || !formData.category}
                  className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'technical' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {editingQuestion ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
