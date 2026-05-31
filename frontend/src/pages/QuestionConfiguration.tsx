import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Search, Code, Heart, List } from "lucide-react";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, type Question, type QuestionType } from '../services/questions';
import { getProjectRoleNames } from '../services/projects';

const technicalCategories = ['Qualidade', 'Desempenho', 'Aprendizado', 'Mentoria', 'Arquitetura'];
const behavioralCategories = ['Comunicação', 'Proatividade', 'Colaboração', 'Iniciativa', 'Liderança'];

export default function QuestionConfiguration() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | QuestionType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roleNames, setRoleNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formData, setFormData] = useState<{ text: string; roleName: string; category: string; type: QuestionType }>({
    text: '',
    roleName: '',
    category: '',
    type: 'technical',
  });

  useEffect(() => {
    Promise.all([getQuestions(), getProjectRoleNames()])
      .then(([qs, roles]) => {
        setQuestions(qs);
        setRoleNames(roles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredQuestions = questions.filter(q =>
    (activeTab === 'all' || q.type === activeTab) &&
    (q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
     q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (q.role_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getQuestionTheme = (type: QuestionType) =>
    type === 'technical'
      ? {
          border: 'border-blue-100',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700',
          label: 'Técnica',
        }
      : {
          border: 'border-purple-100',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700',
          label: 'Comportamental',
        };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir pergunta');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({ text: question.text, roleName: question.role_name || '', category: question.category, type: question.type });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.text || !formData.category) return;
    if (!editingQuestion && !window.confirm('Confirmar inclusão desta nova pergunta?')) return;
    setSaving(true);
    try {
      if (editingQuestion) {
        const updated = await updateQuestion(editingQuestion.id, {
          text: formData.text,
          role_name: formData.roleName || null,
          category: formData.category,
          type: formData.type,
        });
        setQuestions(questions.map(q => q.id === editingQuestion.id ? updated : q));
      } else {
        const created = await createQuestion({
          text: formData.text,
          type: formData.type,
          role_name: formData.roleName || null,
          category: formData.category,
          is_active: true,
        });
        setQuestions([...questions, created]);
      }
      setShowAddModal(false);
      setEditingQuestion(null);
      setFormData({ text: '', roleName: '', category: '', type: 'technical' });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar pergunta');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({ text: '', roleName: '', category: '', type: activeTab === 'behavioral' ? 'behavioral' : 'technical' });
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
              onClick={() => setActiveTab('all')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-50 text-slate-800 border-b-2 border-slate-500'
                  : 'bg-white text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Todas</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'all' ? 'bg-slate-100 text-slate-800' : 'bg-muted text-muted-foreground'
              }`}>
                {questions.length}
              </span>
            </button>
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg hover:opacity-90 transition-colors bg-primary"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nova Pergunta</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const theme = getQuestionTheme(question.type);

            return (
            <div key={question.id} className={`bg-white rounded-xl border-2 p-4 sm:p-6 hover:shadow-md transition-shadow ${theme.border}`}>
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <p className="text-sm sm:text-base mb-3">{question.text}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full border text-xs sm:text-sm ${theme.badge}`}>
                      {theme.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-xs sm:text-sm ${theme.badge}`}>
                      {question.category}
                    </span>
                    {question.role_name && (
                      <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full border border-slate-200 text-xs sm:text-sm">
                        {question.role_name}
                      </span>
                    )}
                    {!question.role_name && (
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
          )})}

          {loading && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Carregando perguntas...</p>
            </div>
          )}
          {!loading && filteredQuestions.length === 0 && (
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
              {formData.type === 'technical' ? ' Técnica' : ' Comportamental'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType, category: '' })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border text-sm"
                >
                  <option value="technical">Técnica</option>
                  <option value="behavioral">Comportamental</option>
                </select>
              </div>
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
                  {(formData.type === 'technical' ? technicalCategories : behavioralCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Cargo Específico <span className="text-muted-foreground">(opcional)</span>
                </label>
                <select
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border text-sm"
                >
                  <option value="">Todos os cargos</option>
                  {roleNames.map(role => (
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
                    setFormData({ text: '', roleName: '', category: '', type: 'technical' });
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.text || !formData.category}
                  className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${getQuestionTheme(formData.type).button}`}
                >
                  {saving ? 'Salvando...' : editingQuestion ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
