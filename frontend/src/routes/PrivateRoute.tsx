import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente PrivateRoute
 * 
 * Protege rotas que requerem autenticação.
 * - Verifica se existe um token no localStorage
 * - Se autenticado: renderiza o componente filho
 * - Se não autenticado: redireciona para /login
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};