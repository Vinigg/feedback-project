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
import { PrivateRoute } from './routes/PrivateRoute';

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
        <Route path="/technical-leader" element={<PrivateRoute allowedRoles={['technical-leader', 'admin']}><TechnicalLeaderDashboard /></PrivateRoute>} />
        <Route path="/technical-leader/evaluate/:projectId/:employeeId" element={<PrivateRoute allowedRoles={['technical-leader', 'admin']}><TechnicalEvaluationForm /></PrivateRoute>} />
        <Route path="/behavioral-leader" element={<PrivateRoute allowedRoles={['behavioral-leader', 'admin']}><BehavioralLeaderDashboard /></PrivateRoute>} />
        <Route path="/behavioral-leader/evaluate/:projectId/:employeeId" element={<PrivateRoute allowedRoles={['behavioral-leader', 'admin']}><BehavioralEvaluationForm /></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute allowedRoles={['employee', 'admin']}><EmployeeDashboard /></PrivateRoute>} />
        <Route path="/employee/history" element={<PrivateRoute allowedRoles={['employee', 'admin']}><EmployeeHistory /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/roles" element={<PrivateRoute allowedRoles={['admin']}><RoleManagement /></PrivateRoute>} />
        <Route path="/admin/questions" element={<PrivateRoute allowedRoles={['admin']}><QuestionConfiguration /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute allowedRoles={['admin']}><Reports /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
