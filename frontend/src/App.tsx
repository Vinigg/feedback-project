import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './routes/PrivateRoute';

// Páginas - Públicas
import Login from './pages/Login';

// Páginas - Protegidas
import Dashboard from './pages/Dashboard';
import Feedbacks from './pages/Feedbacks';
import CreateFeedback from './pages/CreateFeedback';
import FeedbackDetails from './pages/FeedbackDetails';
import Profile from './pages/Profile';

/**
 * Componente App
 * 
 * Componente principal da aplicação que configura todo o roteamento.
 * Usa React Router v6 com BrowserRouter.
 * 
 * Rotas:
 * - /login: Rota pública para autenticação
 * - /dashboard: Rota protegida para dashboard principal
 * - /feedbacks: Rota protegida para lista de feedbacks
 * - /feedbacks/create: Rota protegida para criar feedback
 * - /feedbacks/:id: Rota protegida para detalhes do feedback
 * - /profile: Rota protegida para perfil do usuário
 * - /: Redireciona para /dashboard
 */

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rotas exclusivas de Líder */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin', 'leader']}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rotas compartilhadas (líder e liderado) */}
        <Route
          path="/feedbacks"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <Feedbacks />
            </PrivateRoute>
          }
        />

        <Route
          path="/feedbacks/create"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <CreateFeedback />
            </PrivateRoute>
          }
        />

        <Route
          path="/feedbacks/:id"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <FeedbackDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['rh']}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Rota Padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
