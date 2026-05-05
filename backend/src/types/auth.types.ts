// Type definitions for authentication

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = 'leader' | 'employee';

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

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}