import { getAuthenticatedUser } from '../services/auth.service';

/**
 * Página Dashboard
 * 
 * Rota protegida - visão geral principal do sistema de feedbacks.
 * Exibe informações do usuário e um cartão base de estatísticas.
 */

export const Dashboard = () => {
  const user = getAuthenticatedUser();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {user && (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '600px',
            background: '#f9f9f9',
            marginBottom: '20px',
          }}
        >
          <h2>Bem-vindo, {user.name}</h2>
          <p>Tipo de usuário: <strong>{user.role}</strong></p>
          <p>Este é o seu painel inicial. Use as rotas do sistema para continuar.</p>
        </div>
      )}
      <p>Bem-vindo ao painel do Sistema de Gestão de Feedbacks.</p>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', background: '#fff' }}>
          <h3>Total de feedbacks</h3>
          <p>12</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', background: '#fff' }}>
          <h3>Feedbacks pendentes</h3>
          <p>4</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', background: '#fff' }}>
          <h3>Usuários ativos</h3>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;