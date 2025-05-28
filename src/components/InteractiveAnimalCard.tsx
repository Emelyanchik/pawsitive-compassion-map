
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Share, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageCircle,
  Star,
  Calendar,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Animal {
  id: string;
  name: string;
  type: 'cat' | 'dog';
  status: 'needs_help' | 'being_helped' | 'adopted' | 'safe';
  description: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  helpProgress: number;
  volunteersInvolved: number;
  estimatedCost: number;
}

interface InteractiveAnimalCardProps {
  animal: Animal;
  onHelp?: (animalId: string) => void;
  onShare?: (animalId: string) => void;
  onContact?: (animalId: string) => void;
}

export const InteractiveAnimalCard: React.FC<InteractiveAnimalCardProps> = ({ 
  animal, 
  onHelp, 
  onShare, 
  onContact 
}) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [helpOffered, setHelpOffered] = useState(false);

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    needs_help: 'bg-red-100 text-red-800',
    being_helped: 'bg-blue-100 text-blue-800',
    adopted: 'bg-green-100 text-green-800',
    safe: 'bg-purple-100 text-purple-800'
  };

  const handleQuickHelp = () => {
    setHelpOffered(true);
    onHelp?.(animal.id);
    toast({
      title: "Спасибо за помощь!",
      description: `Вы предложили помощь для ${animal.name}. Волонтер свяжется с вами.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Убрано из избранного" : "Добавлено в избранное",
      description: `${animal.name} ${isLiked ? 'убран из' : 'добавлен в'} ваш список избранного.`,
    });
  };

  const handleQuickShare = () => {
    onShare?.(animal.id);
    toast({
      title: "История поделена!",
      description: `История ${animal.name} опубликована в ваших социальных сетях.`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">
            {animal.type === 'cat' ? '🐱' : '🐶'}
          </div>
        </div>
        
        {/* Статус и срочность */}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={urgencyColors[animal.urgency]}>
            {animal.urgency === 'critical' && <Zap className="h-3 w-3 mr-1" />}
            {animal.urgency}
          </Badge>
          <Badge className={statusColors[animal.status]}>
            {animal.status === 'adopted' && <CheckCircle className="h-3 w-3 mr-1" />}
            {animal.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Кнопка лайка */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{animal.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-3 w-3" />
              {animal.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="h-3 w-3" />
              {animal.volunteersInvolved} волонтеров
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${animal.estimatedCost} нужно
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Прогресс помощи */}
        {animal.helpProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс помощи</span>
              <span>{animal.helpProgress}%</span>
            </div>
            <Progress value={animal.helpProgress} className="h-2" />
          </div>
        )}

        <p className="text-sm text-gray-700 line-clamp-2">{animal.description}</p>

        {/* Информация о репорте */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Сообщено {new Date(animal.reportedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {animal.reportedBy}
          </div>
        </div>

        {/* Действия */}
        <div className="flex gap-2 pt-2">
          {!helpOffered ? (
            <Button 
              onClick={handleQuickHelp}
              className="flex-1"
              variant={animal.urgency === 'critical' ? 'destructive' : 'default'}
            >
              <Heart className="h-4 w-4 mr-2" />
              Помочь
            </Button>
          ) : (
            <Button disabled className="flex-1" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Помощь предложена
            </Button>
          )}
          
          <Button variant="outline" onClick={handleQuickShare}>
            <Share className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={() => onContact?.(animal.id)}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Быстрые действия */}
        <div className="flex gap-2 text-xs">
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Star className="h-3 w-3 mr-1" />
            Отметить
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Calendar className="h-3 w-3 mr-1" />
            Запланировать
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Phone className="h-3 w-3 mr-1" />
            Связаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
