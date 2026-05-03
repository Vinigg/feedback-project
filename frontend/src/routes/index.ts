/**
 * Índice de Rotas
 * 
 * Exportação central para todos os componentes e utilitários de rota.
 * Este arquivo facilita o gerenciamento e importação de componentes relacionados a roteamento.
 */

export { PrivateRoute } from './PrivateRoute';

// Constantes dos caminhos das rotas
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FEEDBACKS: '/feedbacks',
  CREATE_FEEDBACK: '/feedbacks/create',
  FEEDBACK_DETAILS: '/feedbacks/:id',
  PROFILE: '/profile',
} as const;
