'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingBasket, Shield, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dados de demonstração (simulando banco de dados)
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@cestodeofertas.com',
    password: 'admin123',
    isAdmin: true,
    firstLogin: false,
    name: 'Administrador Master'
  },
  {
    id: '2', 
    email: 'usuario@teste.com',
    password: 'user123',
    isAdmin: false,
    firstLogin: true,
    name: 'Usuário Teste'
  }
];

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }

      // Salvar usuário no localStorage (simulando sessão)
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setSuccess('Login realizado com sucesso!');
      
      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        if (user.firstLogin) {
          router.push('/first-login');
        } else if (user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 1500);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simular delay de registro
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Verificar se email já existe
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Este email já está cadastrado');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Simular criação de usuário
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        isAdmin: false,
        firstLogin: true,
        name: email.split('@')[0]
      };

      // Salvar usuário no localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        router.push('/first-login');
      }, 1500);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail('admin@cestodeofertas.com');
      setPassword('admin123');
    } else {
      setEmail('usuario@teste.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <ShoppingBasket className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Cesto de Ofertas
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Informações */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Automatize suas vendas no
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  WhatsApp
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Plataforma completa para afiliados Shopee automatizarem o envio de ofertas em grupos do WhatsApp
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Automação</h3>
                <p className="text-sm text-gray-600">Envie mensagens automaticamente nos horários programados</p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
                <p className="text-sm text-gray-600">Dados criptografados e isolados por usuário</p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multi-usuário</h3>
                <p className="text-sm text-gray-600">Cada usuário tem seu próprio espaço privado</p>
              </div>
            </div>
          </div>

          {/* Lado direito - Login/Registro */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Acesse sua conta para continuar' 
                    : 'Crie sua conta gratuita agora'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLogin ? 'Entrando...' : 'Criando conta...'}
                      </>
                    ) : (
                      isLogin ? 'Entrar' : 'Criar Conta'
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      {isLogin 
                        ? 'Não tem conta? Criar uma agora' 
                        : 'Já tem conta? Fazer login'
                      }
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Login de demonstração */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">🔧 Contas de Demonstração</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Administrador</p>
                    <p className="text-xs text-blue-700">admin@cestodeofertas.com</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fillDemoCredentials('admin')}
                    className="text-xs"
                  >
                    Usar
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Usuário</p>
                    <p className="text-xs text-blue-700">usuario@teste.com</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fillDemoCredentials('user')}
                    className="text-xs"
                  >
                    Usar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}