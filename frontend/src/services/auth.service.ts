// Serviço para requisições de autenticação

import type { LoginRequest, LoginResponse } from '../types/auth.types';
import { AuthError } from '../types/auth.types';

/**
 * Envia requisição de login para a API do backend
 * 
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Promise com LoginResponse contendo dados do usuário e token
 * @throws AuthError se as credenciais forem inválidas ou a requisição falhar
 */
export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as LoginRequest),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new AuthError(data.message || 'Falha ao fazer login');
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Falha ao conectar com o servidor');
  }
};