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
                  placeholder="seu.email@empresa.com ou ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Use "admin", "carlos", "ana" ou deixe em branco para collaborador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
