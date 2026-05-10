import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const detectUserRole = (email: string): 'admin' | 'technical-leader' | 'behavioral-leader' | 'employee' => {
    // Simular detecção automática baseada no email/ID
    const emailLower = email.toLowerCase();

    // Padrões para Administrador
    const adminPatterns = ['admin', 'adm', 'administrador', 'gestor.sistema'];

    // Padrões para Líder Técnico
    const technicalPatterns = ['tech', 'tecnico', 'carlos', 'miguel', 'arquiteto', 'senior'];

    // Padrões para Líder Comportamental/RH
    const behavioralPatterns = ['rh', 'hr', 'comportamental', 'ana', 'people', 'recursos'];

    if (adminPatterns.some(pattern => emailLower.includes(pattern))) {
      return 'admin';
    } else if (technicalPatterns.some(pattern => emailLower.includes(pattern))) {
      return 'technical-leader';
    } else if (behavioralPatterns.some(pattern => emailLower.includes(pattern))) {
      return 'behavioral-leader';
    }

    return 'employee';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsLoading(true);

    // Simular autenticação e detecção automática
    setTimeout(() => {
      const role = detectUserRole(email);

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'technical-leader') {
        navigate('/technical-leader');
      } else if (role === 'behavioral-leader') {
        navigate('/behavioral-leader');
      } else {
        navigate('/employee');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] to-[#e8eaf0] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-center mb-2">Sistema de Gestão de Desempenho</h1>
            <p className="text-muted-foreground text-center text-sm sm:text-base">
              Acesse com a sua conta da empresa
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">
                Email ou ID Corporativo
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Entrando...</span>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground justify-center">
              <Lock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Conexão segura e encriptada</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-center text-muted-foreground text-xs sm:text-sm">
            O sistema reconhece automaticamente o seu perfil
          </p>
          <div className="text-center text-muted-foreground text-xs space-y-1">
            <p>Demo: 'admin@empresa.com' (Administrador)</p>
            <p>'tech@empresa.com' (Líder Técnico)</p>
            <p>'rh@empresa.com' (Líder Comportamental)</p>
            <p>'joao@empresa.com' (Colaborador)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
