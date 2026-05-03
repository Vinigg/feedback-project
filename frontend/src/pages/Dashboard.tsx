/**
 * Página Dashboard
 * 
 * Rota protegida - visão geral principal do sistema de feedbacks.
 * Exibe estatísticas, feedbacks recentes e ações rápidas.
 */

export const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao painel do Sistema de Gestão de Feedbacks.</p>
      <p>Esta é uma rota protegida. Você precisa estar autenticado para acessá-la.</p>
    </div>
  );
};

export default Dashboard;