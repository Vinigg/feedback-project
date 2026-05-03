import { useState, FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { AuthError } from '../types/auth.types';

/**
 * Página de Login
 * 
 * Rota pública para autenticação de usuários.
 * Usuários inserem credenciais para fazer login no sistema.
 * Ao fazer login com sucesso, redireciona para /dashboard.
 */

const Login: FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await loginRequest(email, password);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setSuccess('Login realizado com sucesso! Redirecionando...');
        
        // Redireciona para dashboard após 1 segundo
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Fazendo login...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Credenciais de teste: admin@email.com / 123456
      </p>
    </div>
  );
};

export default Login;