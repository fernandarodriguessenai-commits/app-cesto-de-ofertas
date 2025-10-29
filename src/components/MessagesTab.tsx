'use client';

import { useState, useEffect } from 'react';
import { MessageConfig, Product, MessageLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Send
} from 'lucide-react';

interface MessagesTabProps {
  userId: string;
}

// Sistema de demonstração local
const sendWhatsAppMessage = async (group: string, message: string) => {
  // Simular envio
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`📱 Mensagem enviada para ${group}:`, message);
  return { success: true, error: null };
};

export default function MessagesTab({ userId }: MessagesTabProps) {
  const [configs, setConfigs] = useState<MessageConfig[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<MessageConfig | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    whatsapp_group: '',
    message_template: '',
    send_interval: '60'
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carregar configurações do localStorage
      const savedConfigs = localStorage.getItem(`message_configs_${userId}`);
      if (savedConfigs) {
        setConfigs(JSON.parse(savedConfigs));
      }

      // Carregar produtos ativos do localStorage
      const savedProducts = localStorage.getItem(`products_${userId}`);
      if (savedProducts) {
        const allProducts = JSON.parse(savedProducts);
        setProducts(allProducts.filter((p: Product) => p.is_active));
      }

      // Carregar logs do localStorage
      const savedLogs = localStorage.getItem(`message_logs_${userId}`);
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }

    } catch (error: any) {
      setError('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const configData: MessageConfig = {
        id: editingConfig?.id || Date.now().toString(),
        whatsapp_group: formData.whatsapp_group,
        message_template: formData.message_template,
        send_interval: parseInt(formData.send_interval),
        user_id: userId,
        is_active: true,
        created_at: editingConfig?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_sent: editingConfig?.last_sent || null
      };

      let updatedConfigs;
      if (editingConfig) {
        // Atualizar configuração existente
        updatedConfigs = configs.map(c => c.id === editingConfig.id ? configData : c);
        setSuccess('Configuração atualizada com sucesso!');
      } else {
        // Criar nova configuração
        updatedConfigs = [configData, ...configs];
        setSuccess('Configuração criada com sucesso!');
      }

      setConfigs(updatedConfigs);
      localStorage.setItem(`message_configs_${userId}`, JSON.stringify(updatedConfigs));

      resetForm();
    } catch (error: any) {
      setError('Erro ao salvar configuração: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: MessageConfig) => {
    setEditingConfig(config);
    setFormData({
      whatsapp_group: config.whatsapp_group,
      message_template: config.message_template,
      send_interval: config.send_interval.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (configId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

    try {
      const updatedConfigs = configs.filter(c => c.id !== configId);
      setConfigs(updatedConfigs);
      localStorage.setItem(`message_configs_${userId}`, JSON.stringify(updatedConfigs));
      setSuccess('Configuração excluída com sucesso!');
    } catch (error: any) {
      setError('Erro ao excluir configuração: ' + error.message);
    }
  };

  const toggleConfigStatus = async (config: MessageConfig) => {
    try {
      const updatedConfigs = configs.map(c => 
        c.id === config.id 
          ? { ...c, is_active: !c.is_active, updated_at: new Date().toISOString() }
          : c
      );
      setConfigs(updatedConfigs);
      localStorage.setItem(`message_configs_${userId}`, JSON.stringify(updatedConfigs));
    } catch (error: any) {
      setError('Erro ao atualizar status: ' + error.message);
    }
  };

  const sendTestMessage = async (config: MessageConfig) => {
    if (products.length === 0) {
      setError('Você precisa ter pelo menos um produto ativo para enviar mensagens');
      return;
    }

    try {
      setLoading(true);
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      // Substituir variáveis no template
      let message = config.message_template
        .replace('{produto}', randomProduct.name)
        .replace('{descricao}', randomProduct.description)
        .replace('{preco}', `R$ ${randomProduct.price.toFixed(2)}`)
        .replace('{link}', randomProduct.affiliate_link);

      // Simular envio
      const result = await sendWhatsAppMessage(config.whatsapp_group, message);

      // Registrar log
      const newLog: MessageLog = {
        id: Date.now().toString(),
        user_id: userId,
        product_id: randomProduct.id,
        message_config_id: config.id,
        message_content: message,
        sent_at: new Date().toISOString(),
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null
      };

      const updatedLogs = [newLog, ...logs.slice(0, 9)]; // Manter apenas 10 logs
      setLogs(updatedLogs);
      localStorage.setItem(`message_logs_${userId}`, JSON.stringify(updatedLogs));

      if (result.success) {
        setSuccess('Mensagem de teste enviada com sucesso!');
      } else {
        setError('Falha no envio: ' + result.error);
      }

    } catch (error: any) {
      setError('Erro ao enviar mensagem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      whatsapp_group: '',
      message_template: '',
      send_interval: '60'
    });
    setEditingConfig(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações de Mensagens</h2>
          <p className="text-gray-600">Configure o envio automático para grupos do WhatsApp</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Configuração
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Warning sobre produtos */}
      {products.length === 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            ⚠️ Você precisa ter pelo menos um produto ativo na aba "Produtos" para configurar mensagens automáticas.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingConfig ? 'Editar Configuração' : 'Nova Configuração'}
            </CardTitle>
            <CardDescription>
              Configure como e quando as mensagens serão enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_group">Nome/ID do Grupo WhatsApp</Label>
                <Input
                  id="whatsapp_group"
                  placeholder="Ex: Ofertas Shopee, Grupo Afiliados..."
                  value={formData.whatsapp_group}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_group: e.target.value }))}
                  required
                />
                <p className="text-xs text-gray-500">
                  Identificação do grupo onde as mensagens serão enviadas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="send_interval">Intervalo de Envio (minutos)</Label>
                <Input
                  id="send_interval"
                  type="number"
                  min="5"
                  placeholder="60"
                  value={formData.send_interval}
                  onChange={(e) => setFormData(prev => ({ ...prev, send_interval: e.target.value }))}
                  required
                />
                <p className="text-xs text-gray-500">
                  Tempo entre cada envio automático (mínimo 5 minutos)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message_template">Template da Mensagem</Label>
                <textarea
                  id="message_template"
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="🔥 OFERTA IMPERDÍVEL! 🔥&#10;&#10;{produto}&#10;{descricao}&#10;&#10;💰 Apenas {preco}&#10;&#10;🛒 Compre agora: {link}&#10;&#10;#Shopee #Ofertas"
                  value={formData.message_template}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_template: e.target.value }))}
                  required
                />
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Variáveis disponíveis:</strong></p>
                  <p>• <code>{'{produto}'}</code> - Nome do produto</p>
                  <p>• <code>{'{descricao}'}</code> - Descrição do produto</p>
                  <p>• <code>{'{preco}'}</code> - Preço formatado</p>
                  <p>• <code>{'{link}'}</code> - Link de afiliado</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {editingConfig ? 'Atualizar' : 'Criar'} Configuração
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Configurations List */}
      {configs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma configuração criada</h3>
            <p className="text-gray-600 mb-4">Configure seu primeiro envio automático de mensagens</p>
            <Button
              onClick={() => setShowForm(true)}
              disabled={products.length === 0}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Configuração
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {configs.map((config) => (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      config.is_active 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.whatsapp_group}</CardTitle>
                      <CardDescription>
                        Envio a cada {config.send_interval} minutos
                        {config.last_sent && (
                          <span className="ml-2">
                            • Último envio: {new Date(config.last_sent).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {config.is_active ? (
                      <div className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>Inativo</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Template da Mensagem:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                      {config.message_template}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleConfigStatus(config)}
                      className={config.is_active ? 'text-red-600' : 'text-green-600'}
                    >
                      {config.is_active ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendTestMessage(config)}
                      disabled={products.length === 0 || loading}
                      className="text-blue-600"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Teste
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Histórico Recente</span>
            </CardTitle>
            <CardDescription>
              Últimas mensagens enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => {
                const product = products.find(p => p.id === log.product_id);
                const config = configs.find(c => c.id === log.message_config_id);
                
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${
                        log.status === 'sent' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {log.status === 'sent' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {product?.name || 'Produto removido'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.sent_at).toLocaleString('pt-BR')} • 
                          {config?.whatsapp_group || 'Grupo removido'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.status === 'sent' ? 'Enviado' : 'Falhou'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <strong>⚠️ Importante sobre Automação WhatsApp:</strong><br />
          Esta é uma demonstração. Para implementação real, você precisará integrar com:
          <br />• WhatsApp Business API (oficial, mas limitada)
          <br />• Bibliotecas como whatsapp-web.js (não oficial, risco de banimento)
          <br />• Serviços como Twilio, MessageBird, etc.
          <br /><br />
          <strong>Recomendação:</strong> Use intervalos longos (60+ minutos) e varie as mensagens para evitar detecção como spam.
        </AlertDescription>
      </Alert>
    </div>
  );
}