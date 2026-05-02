// Service for authentication requests

export interface LoginResponse {

  success: boolean;

  user?: { name: string; email: string };

  token?: string;

  message?: string;

}

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {

  const response = await fetch('http://localhost:3000/api/auth/login', {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify({ email, password }),

  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {

    throw new Error(data.message || 'Login failed');

  }

  return data;

};