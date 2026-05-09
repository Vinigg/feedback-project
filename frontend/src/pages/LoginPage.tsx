import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const profileMap: Array<{ pattern: RegExp; route: string; label: string }> = [
  { pattern: /\b(admin|adm|administrador)\b/i, route: '/admin', label: 'Admin' },
  { pattern: /\b(tech|tecnico|carlos|miguel|senior)\b/i, route: '/technical-leader', label: 'Líder Técnico' },
  { pattern: /\b(rh|hr|ana|people)\b/i, route: '/behavioral-leader', label: 'Líder Comportamental' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function detectProfile(value: string) {
    const normalized = value.toLowerCase();
    const match = profileMap.find((item) => item.pattern.test(normalized));
    if (match) {
      return match.route;
    }
    return '/employee';
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError('');
    navigate(detectProfile(email));
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Bem-vindo</h1>
        <p className="mt-3 text-muted-foreground">Faça login com seu e-mail para acessar o sistema.</p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="seu.email@empresa.com"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
