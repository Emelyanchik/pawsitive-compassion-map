
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Instagram, 
  Share, 
  Image,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const MapInstagramWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const recentPosts = [
    {
      id: '1',
      image: '/placeholder.svg',
      caption: 'Помогли еще одному пушистику! 🐱',
      likes: 24,
      time: '2ч'
    },
    {
      id: '2', 
      image: '/placeholder.svg',
      caption: 'Волонтерская работа в приюте 🐶',
      likes: 18,
      time: '5ч'
    }
  ];

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg">
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

        {/* Quick Stats */}
        <div className="flex justify-between text-xs text-gray-600 mb-3">
          <span>12 постов</span>
          <span>284 подписчика</span>
          <span>+15 за неделю</span>
        </div>

        {/* Quick Share Button */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-3">
              <Share className="h-3 w-3 mr-2" />
              Быстрая публикация
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Поделиться в Instagram</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Выберите животное на карте, чтобы создать пост о нем
              </p>
              <Button className="w-full" onClick={() => setShareDialogOpen(false)}>
                Выбрать животное на карте
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
            <div className="grid grid-cols-2 gap-2">
              {recentPosts.map((post) => (
                <div key={post.id} className="relative group">
                  <img 
                    src={post.image} 
                    alt="Instagram post"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="text-[10px] text-white bg-black/50 rounded px-1 py-0.5 truncate">
                      {post.caption}
                    </div>
                    <div className="flex justify-between text-[10px] text-white mt-1">
                      <span>❤️ {post.likes}</span>
                      <span>{post.time}</span>
                    </div>
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
