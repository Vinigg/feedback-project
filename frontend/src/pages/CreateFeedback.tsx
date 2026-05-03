/**
 * Página Criar Feedback
 * 
 * Rota protegida - formulário para criar um novo feedback.
 * Usuários podem enviar feedback com título, descrição, categoria e classificação.
 */

export const CreateFeedback = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Criar Feedback</h1>
      <p>Crie um novo feedback aqui.</p>
      <p>Esta é uma rota protegida. Você precisa estar autenticado para acessá-la.</p>
    </div>
  );
};

export default CreateFeedback;