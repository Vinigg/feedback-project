// Type definitions for authentication

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
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