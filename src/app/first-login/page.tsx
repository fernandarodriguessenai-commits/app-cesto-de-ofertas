'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingBasket, Mail, Phone, CheckCircle } from 'lucide-react';

// Funções auxiliares locais
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const sendEmailVerification = async (email: string, code: string) => {
  console.log(`📧 Código ${code} enviado para ${email}`);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

const sendSMSVerification = async (phone: string, code: string) => {
  console.log(`📱 Código ${code} enviado para ${phone}`);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

export default function FirstLogin() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Dados do usuário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Códigos de verificação
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [sentEmailCode, setSentEmailCode] = useState('');
  const [sentPhoneCode, setSentPhoneCode] = useState('');

  useEffect(() => {
    // Verificar se usuário está logado (modo demonstração)
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          router.push('/');
          return;
        }

        const user = JSON.parse(currentUser);
        
        // Verificar se ainda é primeiro login
        if (!user.firstLogin) {
          router.push('/dashboard');
          return;
        }

        // Pré-preencher email atual
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Validar dados básicos
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
          throw new Error('Todos os campos são obrigatórios');
        }

        if (!isValidEmail(formData.email)) {
          throw new Error('Email inválido');
        }

        if (!isValidPhone(formData.phone)) {
          throw new Error('Telefone inválido');
        }

        if (formData.newPassword.length < 6) {
          throw new Error('Nova senha deve ter pelo menos 6 caracteres');
        }

        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Senhas não coincidem');
        }

        setStep(2);
      } else if (step === 2) {
        // Enviar códigos de verificação
        const emailVerificationCode = generateVerificationCode();
        const phoneVerificationCode = generateVerificationCode();

        setSentEmailCode(emailVerificationCode);
        setSentPhoneCode(phoneVerificationCode);

        // Enviar códigos (simulação)
        await sendEmailVerification(formData.email, emailVerificationCode);
        await sendSMSVerification(formData.phone, phoneVerificationCode);

        setSuccess('Códigos de verificação enviados!');
        setStep(3);
      } else if (step === 3) {
        // Verificar códigos
        if (emailCode !== sentEmailCode) {
          throw new Error('Código de email incorreto');
        }

        if (phoneCode !== sentPhoneCode) {
          throw new Error('Código de telefone incorreto');
        }

        // Atualizar dados do usuário (modo demonstração)
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updatedUser = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          firstLogin: false,
          emailVerified: true,
          phoneVerified: true,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        setSuccess('Conta configurada com sucesso!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                {step === 1 && 'Configure sua Conta'}
                {step === 2 && 'Verificação Necessária'}
                {step === 3 && 'Confirme os Códigos'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Complete seus dados e defina uma nova senha'}
                {step === 2 && 'Vamos enviar códigos para verificar seu email e telefone'}
                {step === 3 && 'Digite os códigos recebidos para finalizar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Etapa 1: Dados básicos */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Novo Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      placeholder="Seu endereço completo"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Etapa 2: Informação sobre verificação */}
              {step === 2 && (
                <div className="space-y-6 text-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-blue-900">Email</p>
                        <p className="text-sm text-blue-700">{formData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-900">Telefone</p>
                        <p className="text-sm text-green-700">{formData.phone}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Clique em "Enviar Códigos" para receber os códigos de verificação
                  </p>
                </div>
              )}

              {/* Etapa 3: Verificação de códigos */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailCode">Código do Email</Label>
                    <Input
                      id="emailCode"
                      placeholder="Digite o código recebido por email"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Código enviado para: {formData.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneCode">Código do SMS</Label>
                    <Input
                      id="phoneCode"
                      placeholder="Digite o código recebido por SMS"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Código enviado para: {formData.phone}
                    </p>
                  </div>

                  {/* Códigos para demonstração */}
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 font-medium mb-1">🔧 Demonstração:</p>
                    <p className="text-xs text-yellow-700">Email: {sentEmailCode}</p>
                    <p className="text-xs text-yellow-700">SMS: {sentPhoneCode}</p>
                  </div>
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50 mt-4">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleNext}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {step === 1 && 'Continuar'}
                    {step === 2 && 'Enviar Códigos'}
                    {step === 3 && 'Finalizar Configuração'}
                  </>
                )}
              </Button>

              {/* Indicador de progresso */}
              <div className="flex justify-center mt-6 space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= step ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}