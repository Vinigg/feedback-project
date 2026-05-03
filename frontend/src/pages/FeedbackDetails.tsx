import { useParams } from 'react-router-dom';

/**
 * Página Detalhes do Feedback
 * 
 * Rota protegida - exibe a visualização detalhada de um feedback específico.
 * Usuários podem visualizar informações completas, comentários e ações relacionadas.
 * 
 * Parâmetro da URL:
 * - id: O ID do feedback a ser exibido
 */

export const FeedbackDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Detalhes do Feedback</h1>
      <p>Visualizando feedback com ID: {id}</p>
      <p>Esta é uma rota protegida. Você precisa estar autenticado para acessá-la.</p>
    </div>
  );
};

export default FeedbackDetails;