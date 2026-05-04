// Lógica de negócio para autenticação

const MOCK_USERS = [
  {
    email: 'admin@email.com',
    password: '123456',
    name: 'Administrador',
    role: 'admin'
  },
  {
    email: 'lider@email.com',
    password: '123456',
    name: 'Líder',
    role: 'leader'
  },
  {
    email: 'rh@email.com',
    password: '123456',
    name: 'RH',
    role: 'rh'
  },
  {
    email: 'colaborador@email.com',
    password: '123456',
    name: 'Colaborador',
    role: 'employee'
  }
];

export const authenticateUser = (email: string, password: string) => {
  const user = MOCK_USERS.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  return {
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'fake-jwt-token'
  };
};