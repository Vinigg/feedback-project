import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import logoMesa from '../assets/logo-mesa.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type ProfileRole = 'admin' | 'technical-leader' | 'behavioral-leader' | 'employee';

type Profile = {
  role: ProfileRole;
  name: string;
  email: string;
};

const roleRedirects: Record<ProfileRole, string> = {
  admin: '/admin',
  'technical-leader': '/technical-leader',
  'behavioral-leader': '/behavioral-leader',
  employee: '/employee',
};

const isProfileRole = (role: string): role is ProfileRole => {
  return role in roleRedirects;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;

      const { data: profile } = await supabase!
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single<{ role: ProfileRole }>();

      if (profile && isProfileRole(profile.role)) {
        navigate(roleRedirects[profile.role], { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) return;

    setIsLoading(true);
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase não configurado. Verifique o arquivo frontend/.env.');
      setIsLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError('Email ou senha inválidos. Confira os dados e tente novamente.');
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, name, email')
      .eq('id', data.user.id)
      .single<Profile>();

    if (profileError || !profile || !isProfileRole(profile.role)) {
      setError(`Login realizado, mas não foi possível carregar seu perfil.${profileError?.message ? ` ${profileError.message}` : ''}`);
      setIsLoading(false);
      return;
    }

    localStorage.setItem('user', JSON.stringify(profile));

    navigate(roleRedirects[profile.role]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] to-[#e8eaf0] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
          <div className="flex flex-col items-center mb-8">
            <img src={logoMesa} alt="Logo Mesa" className="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-2xl" />
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

            <div>
              <label className="block text-sm mb-2 text-muted-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
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
            Use sua conta corporativa para acessar o sistema
          </p>
        </div>
      </div>
    </div>
  );
}
