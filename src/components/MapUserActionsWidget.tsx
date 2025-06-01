
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  MessageCircle, 
  Camera,
  Phone,
  Share2,
  MapPin,
  Heart,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserAction {
  id: string;
  type: 'report' | 'help' | 'volunteer' | 'share';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'in_progress';
}

export const MapUserActionsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const [recentActions] = useState<UserAction[]>([
    {
      id: '1',
      type: 'report',
      title: 'Сообщил о коте',
      description: 'Найден кот около парка',
      timestamp: '5 мин назад',
      status: 'in_progress'
    },
    {
      id: '2',
      type: 'help',
      title: 'Помог собаке',
      description: 'Доставил в ветклинику',
      timestamp: '2 часа назад',
      status: 'completed'
    }
  ]);

  const quickActions = [
    {
      icon: <Camera className="h-4 w-4" />,
      label: 'Сфото-репорт',
      color: 'bg-blue-500',
      action: () => handleQuickAction('photo')
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: 'Вызов помощи',
      color: 'bg-red-500',
      action: () => handleQuickAction('emergency')
    },
    {
      icon: <UserPlus className="h-4 w-4" />,
      label: 'Волонтёр',
      color: 'bg-green-500',
      action: () => handleQuickAction('volunteer')
    },
    {
      icon: <Share2 className="h-4 w-4" />,
      label: 'Поделиться',
      color: 'bg-purple-500',
      action: () => handleQuickAction('share')
    }
  ];

  const handleQuickAction = (actionType: string) => {
    const actionMessages = {
      photo: 'Откроется камера для создания фото-репорта',
      emergency: 'Вызов экстренной помощи животному',
      volunteer: 'Регистрация как волонтер в этом районе',
      share: 'Поделиться текущим местоположением'
    };

    toast({
      title: "Быстрое действие",
      description: actionMessages[actionType as keyof typeof actionMessages],
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-3 w-3 text-orange-500" />;
      default:
        return <AlertTriangle className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-64 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Мои действия</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-5 w-5 p-0 text-xs"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="h-12 flex flex-col items-center gap-1 p-2"
            >
              <div className={`p-1 rounded-full ${action.color} text-white`}>
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Recent Actions */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600">Недавние действия</div>
          {recentActions.slice(0, isExpanded ? recentActions.length : 2).map((action) => (
            <div key={action.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(action.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{action.title}</div>
                <div className="text-gray-600 truncate">{action.description}</div>
                <div className={`${getStatusColor(action.status)} flex items-center gap-1 mt-1`}>
                  <span>{action.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded text-xs">
          <div className="flex justify-between items-center">
            <span className="font-medium">Ваш рейтинг помощи</span>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              <span className="font-bold text-blue-600">47 ♥</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
