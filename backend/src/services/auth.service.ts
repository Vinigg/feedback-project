// Business logic for authentication

const MOCK_USER = {

  email: 'admin@email.com',

  password: '123456',

  name: 'Admin User'

};

export const authenticateUser = (email: string, password: string) => {

  if (email === MOCK_USER.email && password === MOCK_USER.password) {

    return {

      success: true,

      user: { name: MOCK_USER.name, email: MOCK_USER.email },

      token: 'fake-jwt-token'

    };

  } else {

    throw new Error('Invalid credentials');

  }

};