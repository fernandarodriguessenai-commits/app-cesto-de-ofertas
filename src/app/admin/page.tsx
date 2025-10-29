'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoAuth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBasket, 
  Users, 
  Package, 
  MessageSquare, 
  Video as VideoIcon,
  LogOut, 
  Shield,
  TrendingUp,
  Activity,
  Clock,
  Settings
} from 'lucide-react';
import ProductsTab from '@/components/ProductsTab';
import MessagesTab from '@/components/MessagesTab';
import VideosTab from '@/components/VideosTab';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  firstLogin: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalProducts: 15,
    totalMessages: 127,
    totalVideos: 8,
    activeConfigs: 3,
    recentActivity: []
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = demoAuth.getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }

        if (currentUser.firstLogin) {
          router.push('/first-login');
          return;
        }

        if (!currentUser.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setUser({
          id: currentUser.id,
          name: currentUser.name || 'Administrador',
          email: currentUser.email,
          phone: currentUser.phone,
          address: currentUser.address,
          isAdmin: currentUser.isAdmin,
          firstLogin: currentUser.firstLogin,
          emailVerified: currentUser.emailVerified || true,
          phoneVerified: currentUser.phoneVerified || true
        });

        // Simular carregamento de estatísticas
        loadStats();
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadStats = () => {
    // Dados de demonstração
    setStats({
      totalUsers: 2,
      totalProducts: 15,
      totalMessages: 127,
      totalVideos: 8,
      activeConfigs: 3,
      recentActivity: []
    });
  };

  const handleLogout = async () => {
    await demoAuth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'videos', label: 'Vídeos', icon: VideoIcon },
    { id: 'users', label: 'Usuários', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <ShoppingBasket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Cesto de Ofertas
                </h1>
                <p className="text-xs text-gray-500">Painel Administrativo</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{user.name}</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  Admin
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Menu Admin</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Visão Geral do Sistema</h2>
                  <p className="text-gray-600">Estatísticas e atividades da plataforma</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Produtos Cadastrados</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Mensagens Enviadas</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.totalMessages}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Vídeos Disponíveis</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.totalVideos}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                          <VideoIcon className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Automações Ativas</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.activeConfigs}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Activity className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Sistema</p>
                          <p className="text-lg font-bold text-green-600">Online</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Status do Sistema</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Sistema de Demonstração</span>
                        </div>
                        <span className="text-green-600 text-sm">Ativo</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Autenticação Local</span>
                        </div>
                        <span className="text-green-600 text-sm">Funcionando</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium">WhatsApp API</span>
                        </div>
                        <span className="text-yellow-600 text-sm">Simulação</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Storage Local</span>
                        </div>
                        <span className="text-green-600 text-sm">Disponível</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                      Funcionalidades administrativas principais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => setActiveTab('videos')}
                        className="h-auto p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        <div className="text-center">
                          <VideoIcon className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Gerenciar Vídeos</div>
                          <div className="text-xs opacity-90">Adicionar novos vídeos</div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => setActiveTab('users')}
                        variant="outline"
                        className="h-auto p-4"
                      >
                        <div className="text-center">
                          <Users className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Ver Usuários</div>
                          <div className="text-xs text-gray-500">Gerenciar contas</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'products' && <ProductsTab userId={user.id} />}
            {activeTab === 'messages' && <MessagesTab userId={user.id} />}
            {activeTab === 'videos' && <VideosTab userId={user.id} isAdmin={user.isAdmin} />}
            
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
                  <p className="text-gray-600">Visualize e gerencie todas as contas de usuários</p>
                </div>

                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Gerenciamento de Usuários</h3>
                    <p className="text-gray-600 mb-4">
                      Funcionalidade em desenvolvimento. Em breve você poderá:
                    </p>
                    <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600">
                      <p>• Ver lista completa de usuários</p>
                      <p>• Ativar/desativar contas</p>
                      <p>• Ver estatísticas por usuário</p>
                      <p>• Gerenciar permissões</p>
                      <p>• Enviar notificações</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}