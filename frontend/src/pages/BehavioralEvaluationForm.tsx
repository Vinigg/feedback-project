import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, CheckCircle, Calendar } from "lucide-react";

interface MonthlyAnnotation {
  destaqueComportamental: string;
  antecipacaoRiscos: string;
  apoioColegas: string;
  qualidadeComunicacao: string;
  iniciativa: string;
}

export default function BehavioralEvaluationForm() {
  const navigate = useNavigate();
  const { projectId, employeeId } = useParams();

  const [annotation, setAnnotation] = useState<MonthlyAnnotation>({
    destaqueComportamental: '',
    antecipacaoRiscos: '',
    apoioColegas: '',
    qualidadeComunicacao: '',
    iniciativa: ''
  });

  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        navigate('/behavioral-leader');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/behavioral-leader')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl text-white">Avaliação Comportamental</h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            Projeto #{projectId} - Colaborador #{employeeId}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

          {/* Month Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-base sm:text-lg">Período de Avaliação</h3>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            >
              <option value="2026-04">Abril 2026</option>
              <option value="2026-03">Março 2026</option>
              <option value="2026-02">Fevereiro 2026</option>
              <option value="2026-01">Janeiro 2026</option>
            </select>
          </div>

          <div className="border-t border-border" />

          {/* Monthly Annotation Fields */}
          <div>
            <h2 className="mb-6">Anotações Mensais - Desempenho Comportamental</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2">
                  Destaque de Comportamento
                  <span className="text-muted-foreground text-sm ml-2">(Atitudes e comportamentos positivos)</span>
                </label>
                <textarea
                  value={annotation.destaqueComportamental}
                  onChange={(e) => setAnnotation({ ...annotation, destaqueComportamental: e.target.value })}
                  placeholder="Descreva comportamentos, atitudes ou ações que se destacaram positivamente neste mês..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Antecipação de Riscos
                  <span className="text-muted-foreground text-sm ml-2">(Identificação preventiva de problemas)</span>
                </label>
                <textarea
                  value={annotation.antecipacaoRiscos}
                  onChange={(e) => setAnnotation({ ...annotation, antecipacaoRiscos: e.target.value })}
                  placeholder="Relate se o colaborador identificou e comunicou riscos ou problemas antes que se tornassem críticos..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Apoio aos Colegas
                  <span className="text-muted-foreground text-sm ml-2">(Colaboração e suporte à equipe)</span>
                </label>
                <textarea
                  value={annotation.apoioColegas}
                  onChange={(e) => setAnnotation({ ...annotation, apoioColegas: e.target.value })}
                  placeholder="Descreva como o colaborador apoiou, ajudou ou colaborou com outros membros da equipe..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Qualidade da Comunicação
                  <span className="text-muted-foreground text-sm ml-2">(Clareza, assertividade e efetividade)</span>
                </label>
                <textarea
                  value={annotation.qualidadeComunicacao}
                  onChange={(e) => setAnnotation({ ...annotation, qualidadeComunicacao: e.target.value })}
                  placeholder="Avalie como o colaborador se comunicou com a equipe, clareza nas informações, participação em reuniões..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Iniciativa
                  <span className="text-muted-foreground text-sm ml-2">(Ações voluntárias e proatividade)</span>
                </label>
                <textarea
                  value={annotation.iniciativa}
                  onChange={(e) => setAnnotation({ ...annotation, iniciativa: e.target.value })}
                  placeholder="Relate iniciativas voluntárias, melhorias propostas, ou ações proativas tomadas pelo colaborador..."
                  className="w-full min-h-[100px] p-3 sm:p-4 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* File Upload */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-base sm:text-lg">Anexar Evidências</h3>
              <span className="text-xs sm:text-sm text-muted-foreground">(opcional)</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Adicione documentos, relatórios ou evidências comportamentais
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => navigate('/behavioral-leader')}
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
