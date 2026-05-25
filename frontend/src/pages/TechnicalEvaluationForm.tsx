import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, CheckCircle, Calendar } from "lucide-react";
import { useCurrentUser } from '../hooks/useCurrentUser';
import { createEvaluation } from '../services/evaluations';
import { getProjects } from '../services/projects';
import { getAllProfiles } from '../services/profiles';

interface MonthlyAnnotation {
  destaqueTecnico: string;
  pontoAtencao: string;
  nivelEntrega: string;
  aprendizado: string;
  mentoria: string;
}

export default function TechnicalEvaluationForm() {
  const navigate = useNavigate();
  const { projectId, employeeId } = useParams();
  const { userId } = useCurrentUser();

  const [projectName, setProjectName] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('');
  const [annotation, setAnnotation] = useState<MonthlyAnnotation>({
    destaqueTecnico: '',
    pontoAtencao: '',
    nivelEntrega: '',
    aprendizado: '',
    mentoria: ''
  });
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !employeeId) return;
    Promise.all([getProjects(), getAllProfiles()])
      .then(([projects, profiles]) => {
        const proj = projects.find((p) => p.id === projectId);
        if (proj) setProjectName(proj.name);
        const emp = profiles.find((p) => p.id === employeeId);
        if (emp) setEmployeeName(emp.name);
      })
      .catch(console.error);
  }, [projectId, employeeId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSave = async () => {
    if (!userId || !employeeId) return;
    setIsSaving(true);
    setError(null);
    try {
      await createEvaluation({
        evaluation_type: 'technical',
        employee_id: employeeId,
        leader_id: userId,
        project_id: projectId,
        period: selectedMonth,
        answers: annotation as unknown as Record<string, unknown>,
      });
      setSaved(true);
      setTimeout(() => navigate('/technical-leader'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar avaliação');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/technical-leader')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Avaliação Técnica</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            {projectName || `Projeto #${projectId}`} — {employeeName || `Colaborador #${employeeId}`}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

          {/* Month Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-base sm:text-lg text-foreground">Período de Avaliação</h3>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            >
              {Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const value = d.toISOString().slice(0, 7);
                const label = d.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
                return <option key={value} value={value}>{label}</option>;
              })}
            </select>
          </div>

          <div className="border-t border-border" />

          {/* Monthly Annotation Fields */}
          <div>
            <h2 className="mb-6 text-foreground">Anotações Mensais - Desempenho Técnico</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-foreground">
                  Destaque Técnico
                  <span className="text-muted-foreground text-sm ml-2">(Principais conquistas do mês)</span>
                </label>
                <textarea
                  value={annotation.destaqueTecnico}
                  onChange={(e) => setAnnotation({ ...annotation, destaqueTecnico: e.target.value })}
                  placeholder="Descreva as principais entregas, soluções técnicas ou conquistas significativas deste mês..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2 text-foreground">
                  Ponto de Atenção
                  <span className="text-muted-foreground text-sm ml-2">(Áreas que precisam de melhoria)</span>
                </label>
                <textarea
                  value={annotation.pontoAtencao}
                  onChange={(e) => setAnnotation({ ...annotation, pontoAtencao: e.target.value })}
                  placeholder="Identifique desafios, dificuldades técnicas ou áreas onde o colaborador pode melhorar..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Nível de Entrega
                  <span className="text-muted-foreground text-sm ml-2">(Comparado ao esperado)</span>
                </label>
                <textarea
                  value={annotation.nivelEntrega}
                  onChange={(e) => setAnnotation({ ...annotation, nivelEntrega: e.target.value })}
                  placeholder="Avalie se o volume e qualidade das entregas estão acima, dentro ou abaixo do esperado para o período..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Aprendizado e Atualização
                  <span className="text-muted-foreground text-sm ml-2">(Evolução técnica)</span>
                </label>
                <textarea
                  value={annotation.aprendizado}
                  onChange={(e) => setAnnotation({ ...annotation, aprendizado: e.target.value })}
                  placeholder="Registre novas tecnologias, práticas ou habilidades que o colaborador aprendeu ou demonstrou interesse..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Mentoria e Colaboração Técnica
                  <span className="text-muted-foreground text-sm ml-2">(Apoio a outros desenvolvedores)</span>
                </label>
                <textarea
                  value={annotation.mentoria}
                  onChange={(e) => setAnnotation({ ...annotation, mentoria: e.target.value })}
                  placeholder="Descreva se o colaborador ajudou tecnicamente outros membros da equipe, fez code reviews, compartilhou conhecimento..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* File Upload */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-base sm:text-lg">Anexar Arquivos</h3>
              <span className="text-xs sm:text-sm text-muted-foreground">(opcional)</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Adicione documentos, relatórios ou evidências
            </p>

            <label className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-muted/50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/70 transition-colors">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground text-sm sm:text-base">
                {files.length > 0
                  ? `${files.length} arquivo(s) selecionado(s)`
                  : 'Clique para selecionar arquivos'}
              </span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => navigate('/technical-leader')}
              className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saved}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 order-1 sm:order-2"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Avaliação Salva</span>
                </>
              ) : isSaving ? (
                <span>A salvar...</span>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Salvar Avaliação</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
