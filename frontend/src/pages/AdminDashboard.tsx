import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileQuestion, LogOut, BarChart3 } from "lucide-react";
import logoMesa from '../assets/logo-mesa.png';
import { supabase } from '../lib/supabase';
import { getRoles } from '../services/roles';
import { getQuestions } from '../services/questions';
import { getProfilesByRole } from '../services/profiles';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ roles: 0, questions: 0, employees: 0 });

  useEffect(() => {
    Promise.all([
      getRoles(),
      getQuestions(),
      getProfilesByRole('employee'),
    ])
      .then(([roles, questions, employees]) => {
        setStats({ roles: roles.length, questions: questions.length, employees: employees.length });
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const adminCards = [
    {
      id: 'roles',
      title: 'Gestão de Cargos',
      description: 'Cadastrar, editar e excluir cargos da organização',
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/roles'
    },
    {
      id: 'questions',
      title: 'Configuração de Perguntas',
      description: 'Criar perguntas técnicas e comportamentais',
      icon: FileQuestion,
      color: 'bg-purple-500',
      path: '/admin/questions'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualizar dados consolidados de desempenho',
      icon: BarChart3,
      color: 'bg-emerald-500',
      path: '/admin/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMesa} alt="Logo Mesa" className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg" />
            <div>
              <h1 className="text-lg sm:text-xl text-white">Painel do Administrador</h1>
              <p className="text-xs sm:text-sm text-white/60">Gerenciar configurações do sistema</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white/60 hover:text-white transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 sm:p-8 text-white mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2">Bem-vindo ao Sistema de Gestão</h2>
          <p className="text-sm sm:text-base opacity-90">
            Configure cargos, perguntas de avaliação e acompanhe o desempenho da organização
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-xl p-6 border border-border cursor-pointer hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total de Cargos</p>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.roles}</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Perguntas Ativas</p>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.questions}</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Colaboradores</p>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.employees}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
