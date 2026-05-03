/**
 * Página Feedbacks
 * 
 * Rota protegida - exibe uma lista de todos os feedbacks.
 * Usuários podem visualizar, filtrar, pesquisar e navegar para detalhes individuais.
 */

export const Feedbacks = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Feedbacks</h1>
      <p>Visualize todos os feedbacks aqui.</p>
      <p>Esta é uma rota protegida. Você precisa estar autenticado para acessá-la.</p>
    </div>
  );
};

export default Feedbacks;