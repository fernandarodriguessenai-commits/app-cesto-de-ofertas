// Sistema de demonstração local - sem dependências externas
// Todas as funcionalidades usando localStorage

// Função para gerar código de verificação
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Função para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Função para formatar telefone
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

// Sistema de autenticação local (demonstração)
export const demoAuth = {
  // Verificar se usuário está logado
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Fazer login
  signIn: async (email: string, password: string) => {
    // Dados de demonstração
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

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    return { user, error: null };
  },

  // Fazer logout
  signOut: async () => {
    localStorage.removeItem('currentUser');
    return { error: null };
  },

  // Registrar novo usuário
  signUp: async (email: string, password: string) => {
    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      isAdmin: false,
      firstLogin: true,
      name: email.split('@')[0]
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { user: newUser, error: null };
  }
};

// Funções de simulação de envio
export const sendEmailVerification = async (email: string, code: string) => {
  console.log(`📧 Código ${code} enviado para ${email}`);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

export const sendSMSVerification = async (phone: string, code: string) => {
  console.log(`📱 Código ${code} enviado para ${phone}`);
  return new Promise(resolve => setTimeout(resolve, 1000));
};