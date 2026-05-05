import { getAuthenticatedUser } from '../services/auth.service';

/**
 * Página Feedbacks
 * 
 * Rota protegida - exibe uma lista de todos os feedbacks para colaboradores.
 * Usuários podem visualizar feedbacks e navegar para detalhes.
 */

export const Feedbacks = () => {
  const user = getAuthenticatedUser();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Feedbacks</h1>
      {user && (
        <p style={{ marginBottom: '20px' }}>
          Usuário: <strong>{user.name}</strong> | Tipo: <strong>{user.role}</strong>
        </p>
      )}
      <p>Visualize todos os feedbacks aqui.</p>
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', maxWidth: '640px', background: '#fff' }}>
        <h2>Resumo rápido</h2>
        <ul>
          <li>Feedbacks aguardando resposta: 2</li>
          <li>Último feedback recebido: 1 hora atrás</li>
        </ul>
      </div>
    </div>
  );
};

export default Feedbacks;