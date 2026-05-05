import { getAuthenticatedUser } from '../services/auth.service';

/**
 * Página Perfil
 * 
 * Rota protegida - gerenciamento do perfil do usuário.
 * Usuários podem visualizar suas informações e o tipo de papel.
 */

export const Profile = () => {
  const user = getAuthenticatedUser();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfil</h1>
      {user ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', maxWidth: '520px', background: '#f7f7f7' }}>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tipo de usuário:</strong> {user.role}</p>
        </div>
      ) : (
        <p>Não foi possível carregar os dados do usuário autenticado.</p>
      )}
      <p>Visualize e gerencie seu perfil aqui.</p>
      <p>Use essa página para revisar suas informações e acessar opções de perfil.</p>
    </div>
  );
};

export default Profile;