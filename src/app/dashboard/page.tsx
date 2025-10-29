'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoAuth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBasket, 
  Package, 
  Settings, 
  Video, 
  LogOut, 
  User as UserIcon,
  MessageSquare,
  Clock,
  Shield
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
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

        if (currentUser.isAdmin) {
          router.push('/admin');
          return;
        }

        setUser({
          id: currentUser.id,
          name: currentUser.name || 'Usuário',
          email: currentUser.email,
          phone: currentUser.phone,
          address: currentUser.address,
          isAdmin: currentUser.isAdmin,
          firstLogin: currentUser.firstLogin,
          emailVerified: currentUser.emailVerified || false,
          phoneVerified: currentUser.phoneVerified || false
        });
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await demoAuth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'videos', label: 'Vídeos Shopee', icon: Video },
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Cesto de Ofertas
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4" />
                <span>{user.name}</span>
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
                <CardTitle className="text-lg">Menu</CardTitle>
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

            {/* Status Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Status da Conta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.emailVerified ? 'Verificado' : 'Não verificado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Telefone</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.phoneVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.phoneVerified ? 'Verificado' : 'Não verificado'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'products' && <ProductsTab userId={user.id} />}
            {activeTab === 'messages' && <MessagesTab userId={user.id} />}
            {activeTab === 'videos' && <VideosTab userId={user.id} isAdmin={user.isAdmin} />}
          </div>
        </div>
      </div>
    </div>
  );
}