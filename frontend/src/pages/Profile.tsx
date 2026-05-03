/**
 * Página Perfil
 * 
 * Rota protegida - gerenciamento do perfil do usuário.
 * Usuários podem visualizar e editar suas informações pessoais, configurações e preferências.
 */

export const Profile = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfil</h1>
      <p>Visualize e gerencie seu perfil aqui.</p>
      <p>Esta é uma rota protegida. Você precisa estar autenticado para acessá-la.</p>
    </div>
  );
};

export default Profile;