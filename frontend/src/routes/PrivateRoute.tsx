import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types/auth.types';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Componente PrivateRoute
 *
 * Protege rotas que requerem autenticação e/ou tipo de usuário.
 * - Sem token: redireciona para /login
 * - Com token, sem role requerida: renderiza o filho
 * - Com token, role não permitida: redireciona para a rota padrão do usuário
 */
export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const role: UserRole | undefined = user?.role;

    if (!role || !allowedRoles.includes(role)) {
      const fallback = role === 'leader' ? '/dashboard' : '/feedbacks';
      return <Navigate to={fallback} replace />;
    }
  }

  return <>{children}</>;
};