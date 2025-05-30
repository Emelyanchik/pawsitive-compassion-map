
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Instagram, 
  Share, 
  Image,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Send,
  Zap,
  TrendingUp
} from 'lucide-react';

export const MapInstagramWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [hashtags, setHashtags] = useState('#animals #help #rescue #volunteer');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const [stats, setStats] = useState({
    followers: 284,
    todayViews: 156,
    weeklyGrowth: 15,
    engagementRate: 8.3
  });

  const recentPosts = [
    {
      id: '1',
      image: '/placeholder.svg',
      caption: 'Помогли еще одному пушистику! 🐱',
      likes: 24,
      comments: 5,
      time: '2ч',
      location: 'Парк Сокольники',
      engagement: 'high'
    },
    {
      id: '2', 
      image: '/placeholder.svg',
      caption: 'Волонтерская работа в приюте 🐶',
      likes: 18,
      comments: 3,
      time: '5ч',
      location: 'Приют "Добрые руки"',
      engagement: 'medium'
    },
    {
      id: '3',
      image: '/placeholder.svg',
      caption: 'Спасибо всем за поддержку! ❤️',
      likes: 31,
      comments: 8,
      time: '1д',
      location: 'Центр города',
      engagement: 'high'
    }
  ];

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayViews: prev.todayViews + Math.floor(Math.random() * 5),
        followers: prev.followers + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSharePost = async () => {
    if (!shareContent.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите текст для публикации.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      setIsPosting(false);
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-sm">Instagram</span>
            <Badge className="bg-green-500 text-white text-xs">Активен</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-purple-600">{stats.followers}</div>
            <div className="text-xs text-gray-600">Подписчиков</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-blue-600">{stats.todayViews}</div>
            <div className="text-xs text-gray-600">Просмотров</div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            +{stats.weeklyGrowth} за неделю
          </span>
          <span>{stats.engagementRate}% вовлеченность</span>
        </div>

        {/* Quick Share Button */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-3">
              <Zap className="h-3 w-3 mr-2" />
              Быстрая публикация
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
                  placeholder="Расскажите историю животного..."
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
                onClick={handleSharePost} 
                disabled={isPosting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isPosting ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Публикация...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Опубликовать
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recent Posts - only show when expanded */}
        {isExpanded && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Image className="h-3 w-3" />
              Последние посты
            </div>
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img 
                      src={post.image} 
                      alt="Instagram post"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute -top-1 -right-1">
                      <ExternalLink className="h-3 w-3 text-gray-500 bg-white rounded-full p-0.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate mb-1">
                      {post.caption}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Heart className="h-2 w-2" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-2 w-2" />
                        {post.comments}
                      </span>
                      <span>{post.time}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      📍 {post.location}
                    </div>
                  </div>
                  <div className={`text-xs px-1 py-0.5 rounded ${getEngagementColor(post.engagement)}`}>
                    {post.engagement === 'high' ? '🔥' : post.engagement === 'medium' ? '📈' : '📊'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
