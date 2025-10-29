'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video as VideoIcon, 
  Upload, 
  Download, 
  Play, 
  Trash2, 
  FileVideo,
  Clock,
  HardDrive,
  Plus,
  Shield
} from 'lucide-react';

interface VideosTabProps {
  userId: string;
  isAdmin: boolean;
}

// Dados de demonstração
const demoVideos: Video[] = [
  {
    id: '1',
    title: 'Smartphone Samsung Galaxy A54 - Review Completo',
    description: 'Vídeo promocional mostrando todas as funcionalidades do smartphone',
    file_url: 'https://exemplo.com/videos/samsung-a54.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=180&fit=crop',
    file_size: 45678912, // ~43MB
    duration: 180, // 3 minutos
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Fone JBL Bluetooth - Unboxing e Teste',
    description: 'Demonstração da qualidade de som e funcionalidades do fone',
    file_url: 'https://exemplo.com/videos/jbl-fone.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=180&fit=crop',
    file_size: 32145678, // ~30MB
    duration: 120, // 2 minutos
    created_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function VideosTab({ userId, isAdmin }: VideosTabProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    thumbnail: null as File | null
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carregar vídeos do localStorage ou usar dados demo
      const savedVideos = localStorage.getItem('videos');
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      } else {
        // Usar vídeos demo
        setVideos(demoVideos);
        localStorage.setItem('videos', JSON.stringify(demoVideos));
      }
    } catch (error: any) {
      setError('Erro ao carregar vídeos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Apenas administradores podem adicionar vídeos');
      return;
    }

    setUploading(true);
    setError('');

    try {
      if (!formData.file) {
        throw new Error('Selecione um arquivo de vídeo');
      }

      // Simular upload do vídeo
      const videoFileName = `video_${Date.now()}_${formData.file.name}`;
      const thumbnailFileName = formData.thumbnail 
        ? `thumb_${Date.now()}_${formData.thumbnail.name}`
        : null;

      // Em produção, fazer upload real para Supabase Storage
      const videoUrl = `https://exemplo.com/videos/${videoFileName}`;
      const thumbnailUrl = thumbnailFileName 
        ? `https://exemplo.com/thumbnails/${thumbnailFileName}`
        : 'https://via.placeholder.com/320x180/f3f4f6/9ca3af?text=Video';

      // Simular informações do arquivo
      const fileSizeBytes = formData.file.size;
      const durationSeconds = 120; // Simulado

      const videoData: Video = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        file_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        file_size: fileSizeBytes,
        duration: durationSeconds,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedVideos = [videoData, ...videos];
      setVideos(updatedVideos);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));

      setSuccess('Vídeo adicionado com sucesso!');
      resetForm();
    } catch (error: any) {
      setError('Erro ao adicionar vídeo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!isAdmin) {
      setError('Apenas administradores podem excluir vídeos');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const updatedVideos = videos.filter(v => v.id !== videoId);
      setVideos(updatedVideos);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      setSuccess('Vídeo excluído com sucesso!');
    } catch (error: any) {
      setError('Erro ao excluir vídeo: ' + error.message);
    }
  };

  const handleDownload = async (video: Video) => {
    try {
      // Em produção, implementar download real
      // Por enquanto, simular download
      const link = document.createElement('a');
      link.href = video.file_url;
      link.download = `${video.title}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(`Download iniciado: ${video.title}`);
    } catch (error: any) {
      setError('Erro ao baixar vídeo: ' + error.message);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file: null,
      thumbnail: null
    });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vídeos Shopee</h2>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Gerencie os vídeos disponíveis para todos os usuários'
              : 'Baixe vídeos promocionais dos produtos'
            }
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Vídeo
          </Button>
        )}
      </div>

      {/* Admin Notice */}
      {!isAdmin && (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Área de Downloads:</strong> Aqui você pode baixar vídeos promocionais dos produtos. 
            Apenas administradores podem adicionar novos vídeos.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Upload Form (Admin Only) */}
      {showForm && isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Vídeo</CardTitle>
            <CardDescription>
              Faça upload de um vídeo promocional para disponibilizar a todos os usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Vídeo</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Smartphone Samsung Galaxy - Promoção"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição do vídeo promocional..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Arquivo de Vídeo</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    file: e.target.files?.[0] || null 
                  }))}
                  required
                />
                <p className="text-xs text-gray-500">
                  Formatos aceitos: MP4, AVI, MOV (máx. 100MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (Opcional)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    thumbnail: e.target.files?.[0] || null 
                  }))}
                />
                <p className="text-xs text-gray-500">
                  Imagem de capa do vídeo (JPG, PNG)
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar Vídeo
                    </>
                  )}
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

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <VideoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isAdmin ? 'Nenhum vídeo adicionado' : 'Nenhum vídeo disponível'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isAdmin 
                ? 'Comece adicionando o primeiro vídeo promocional'
                : 'Aguarde os administradores adicionarem vídeos para download'
              }
            </p>
            {isAdmin && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Vídeo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <HardDrive className="h-3 w-3" />
                    <span>{formatFileSize(video.file_size)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileVideo className="h-3 w-3" />
                    <span>MP4</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(video)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Baixar
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(video.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Usage Instructions */}
      <Alert className="border-blue-200 bg-blue-50">
        <VideoIcon className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          <strong>Como usar os vídeos:</strong><br />
          • Baixe os vídeos promocionais dos produtos<br />
          • Use em suas redes sociais, stories, posts<br />
          • Combine com seus links de afiliado para maximizar conversões<br />
          • Mantenha sempre os vídeos atualizados com as ofertas mais recentes
        </AlertDescription>
      </Alert>

      {/* Technical Note */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertDescription className="text-yellow-800">
          <strong>⚠️ Nota Técnica:</strong> Esta é uma demonstração do sistema de vídeos. 
          Em produção, os vídeos seriam armazenados no Supabase Storage com URLs reais de download.
          O sistema atual simula o funcionamento completo da funcionalidade.
        </AlertDescription>
      </Alert>
    </div>
  );
}