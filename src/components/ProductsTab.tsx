'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon,
  DollarSign,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ProductsTabProps {
  userId: string;
}

// Sistema de demonstração local
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy A54',
    description: 'Smartphone com câmera tripla de 50MP, tela Super AMOLED de 6.4" e bateria de 5000mAh',
    price: 1299.99,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    affiliate_link: 'https://shopee.com.br/smartphone-samsung-galaxy-a54',
    user_id: '2',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Fone de Ouvido Bluetooth JBL',
    description: 'Fone sem fio com cancelamento de ruído, 30h de bateria e som premium',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    affiliate_link: 'https://shopee.com.br/fone-bluetooth-jbl',
    user_id: '2',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function ProductsTab({ userId }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    affiliate_link: ''
  });

  useEffect(() => {
    loadProducts();
  }, [userId]);

  const loadProducts = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carregar produtos do localStorage ou usar dados demo
      const savedProducts = localStorage.getItem(`products_${userId}`);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Usar produtos demo apenas para usuário de teste
        if (userId === '2') {
          setProducts(demoProducts);
          localStorage.setItem(`products_${userId}`, JSON.stringify(demoProducts));
        } else {
          setProducts([]);
        }
      }
    } catch (error: any) {
      setError('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData: Product = {
        id: editingProduct?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        affiliate_link: formData.affiliate_link,
        user_id: userId,
        is_active: true,
        created_at: editingProduct?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let updatedProducts;
      if (editingProduct) {
        // Atualizar produto existente
        updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
        setSuccess('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        updatedProducts = [productData, ...products];
        setSuccess('Produto criado com sucesso!');
      }

      setProducts(updatedProducts);
      localStorage.setItem(`products_${userId}`, JSON.stringify(updatedProducts));

      resetForm();
    } catch (error: any) {
      setError('Erro ao salvar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      affiliate_link: product.affiliate_link
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem(`products_${userId}`, JSON.stringify(updatedProducts));
      setSuccess('Produto excluído com sucesso!');
    } catch (error: any) {
      setError('Erro ao excluir produto: ' + error.message);
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === product.id 
          ? { ...p, is_active: !p.is_active, updated_at: new Date().toISOString() }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(`products_${userId}`, JSON.stringify(updatedProducts));
    } catch (error: any) {
      setError('Erro ao atualizar status: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      affiliate_link: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus Produtos</h2>
          <p className="text-gray-600">Gerencie seus produtos para envio automático</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
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

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </CardTitle>
            <CardDescription>
              Preencha as informações do produto para envio automático
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Smartphone Samsung Galaxy"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="299.99"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição atrativa do produto..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliate_link">Link de Afiliado</Label>
                <Input
                  id="affiliate_link"
                  type="url"
                  placeholder="https://shopee.com.br/..."
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
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

      {/* Products List */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece criando seu primeiro produto para envio automático</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="hidden absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {product.is_active ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Ativo</span>
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <XCircle className="h-3 w-3" />
                      <span>Inativo</span>
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleProductStatus(product)}
                    className={product.is_active ? 'text-red-600' : 'text-green-600'}
                  >
                    {product.is_active ? (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}