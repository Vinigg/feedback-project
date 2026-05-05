// Definições de tipos para autenticação

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'leader' | 'rh' | 'employee';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}