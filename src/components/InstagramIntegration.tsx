
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Instagram, ExternalLink, Unlink, Image, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramIntegrationProps {
  animalData?: {
    name: string;
    type: string;
    location: string;
  };
}

export const InstagramIntegration: React.FC<InstagramIntegrationProps> = ({ animalData }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [hashtags, setHashtags] = useState('#animals #help #rescue #volunteer');

  // Mock Instagram posts data
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      media_url: '/placeholder.svg',
      caption: 'Помогли еще одному пушистому другу найти дом! 🐱',
      timestamp: '2024-01-15T10:30:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '2',
      media_url: '/placeholder.svg',
      caption: 'Волонтерская работа в приюте сегодня 🐶',
      timestamp: '2024-01-10T14:20:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '3',
      media_url: '/placeholder.svg',
      caption: 'Спасибо всем, кто поддерживает наших животных! ❤️',
      timestamp: '2024-01-05T09:15:00Z',
      media_type: 'IMAGE'
    }
  ];

  const handleInstagramConnect = async () => {
    setIsLoading(true);
    
    // Simulate OAuth flow
    try {
      // In real implementation, this would redirect to Instagram OAuth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setPosts(mockPosts);
      
      toast({
        title: "Instagram подключен!",
        description: "Ваш аккаунт Instagram успешно связан с профилем.",
      });
    } catch (error) {
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключить Instagram. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstagramDisconnect = () => {
    setIsConnected(false);
    setPosts([]);
    
    toast({
      title: "Instagram отключен",
      description: "Ваш аккаунт Instagram был отключен от профиля.",
    });
  };

  const handleShareToInstagram = async () => {
    if (!shareContent.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите текст для публикации.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In real implementation, this would post to Instagram API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPost: InstagramPost = {
        id: Date.now().toString(),
        media_url: '/placeholder.svg',
        caption: `${shareContent} ${hashtags}`,
        timestamp: new Date().toISOString(),
        media_type: 'IMAGE'
      };
      
      setPosts(prev => [newPost, ...prev]);
      setShareDialogOpen(false);
      setShareContent('');
      
      toast({
        title: "Опубликовано!",
        description: "Ваш пост успешно опубликован в Instagram.",
      });
    } catch (error) {
      toast({
        title: "Ошибка публикации",
        description: "Не удалось опубликовать пост. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (animalData) {
      setShareContent(`Помогите ${animalData.name} найти дом! Этот замечательный ${animalData.type} ищет любящую семью. Местоположение: ${animalData.location}`);
    }
  }, [animalData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Instagram Интеграция
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Статус:</span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Подключено" : "Не подключено"}
            </Badge>
          </div>
          
          {isConnected ? (
            <div className="flex gap-2">
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Поделиться
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Поделиться в Instagram</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Текст публикации</Label>
                      <Textarea
                        id="content"
                        placeholder="Напишите что-нибудь о животном..."
                        value={shareContent}
                        onChange={(e) => setShareContent(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hashtags">Хештеги</Label>
                      <Input
                        id="hashtags"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="#animals #help #rescue"
                      />
                    </div>
                    <Button 
                      onClick={handleShareToInstagram} 
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Публикация..." : "Опубликовать"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleInstagramDisconnect}
              >
                <Unlink className="h-4 w-4 mr-2" />
                Отключить
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleInstagramConnect}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Instagram className="h-4 w-4 mr-2" />
              {isLoading ? "Подключение..." : "Подключить Instagram"}
            </Button>
          )}
        </div>

        {isConnected && posts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Последние публикации
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {posts.slice(0, 4).map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={post.media_url} 
                      alt="Instagram post"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <ExternalLink className="h-4 w-4 text-white bg-black/50 rounded p-1" />
                    </div>
                  </div>
                  {post.caption && (
                    <div className="p-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
