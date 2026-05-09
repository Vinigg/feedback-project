import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechnicalLeaderDashboard from './pages/TechnicalLeaderDashboard';
import TechnicalEvaluationForm from './pages/TechnicalEvaluationForm';
import BehavioralLeaderDashboard from './pages/BehavioralLeaderDashboard';
import BehavioralEvaluationForm from './pages/BehavioralEvaluationForm';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeHistory from './pages/EmployeeHistory';
import AdminDashboard from './pages/AdminDashboard';
import RoleManagement from './pages/RoleManagement';
import QuestionConfiguration from './pages/QuestionConfiguration';
import Reports from './pages/Reports';

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
        <Route path="/" element={<LoginPage />} />
        <Route path="/technical-leader" element={<TechnicalLeaderDashboard />} />
        <Route path="/technical-leader/evaluate/:projectId/:employeeId" element={<TechnicalEvaluationForm />} />
        <Route path="/behavioral-leader" element={<BehavioralLeaderDashboard />} />
        <Route path="/behavioral-leader/evaluate/:projectId/:employeeId" element={<BehavioralEvaluationForm />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/history" element={<EmployeeHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/questions" element={<QuestionConfiguration />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
