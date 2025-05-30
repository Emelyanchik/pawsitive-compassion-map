
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Heart, 
  MapPin, 
  MessageCircle, 
  X,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_animal' | 'help_request' | 'volunteer_message' | 'status_update';
  title: string;
  message: string;
  time: string;
  urgent?: boolean;
  animal?: {
    name: string;
    type: string;
    location: string;
  };
  user?: {
    name: string;
    avatar?: string;
  };
}

export const MapNotificationWidget: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_animal',
      title: 'Новое животное рядом',
      message: 'Найден котенок в 500м от вас',
      time: '2 мин назад',
      urgent: true,
      animal: {
        name: 'Рыжик',
        type: 'cat',
        location: 'Парк Сокольники'
      }
    },
    {
      id: '2',
      type: 'help_request',
      title: 'Запрос о помощи',
      message: 'Волонтер просит помощь с транспортировкой',
      time: '5 мин назад',
      user: {
        name: 'Мария К.',
        avatar: '/placeholder.svg'
      }
    },
    {
      id: '3',
      type: 'volunteer_message',
      title: 'Сообщение от волонтера',
      message: 'Спасибо за помощь с Барсиком!',
      time: '10 мин назад',
      user: {
        name: 'Алексей М.',
        avatar: '/placeholder.svg'
      }
    },
    {
      id: '4',
      type: 'status_update',
      title: 'Обновление статуса',
      message: 'Рекс нашел дом! 🎉',
      time: '15 мин назад',
      animal: {
        name: 'Рекс',
        type: 'dog',
        location: 'ул. Арбат'
      }
    }
  ];

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'new_animal',
          title: 'Срочно! Новое животное',
          message: 'Требуется немедленная помощь',
          time: 'Только что',
          urgent: true,
          animal: {
            name: 'Неизвестно',
            type: 'cat',
            location: 'Центр города'
          }
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [toast]);

  // Initialize with mock data
  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.length);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_animal': return <Heart className="h-4 w-4 text-red-500" />;
      case 'help_request': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'volunteer_message': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'status_update': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-blue-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            <span className="font-medium text-sm">Уведомления</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} новых
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) markAsRead();
            }}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <X className="h-3 w-3" />
            ) : (
              <span className="text-xs">{notifications.length}</span>
            )}
          </Button>
        </div>

        {/* Quick summary when collapsed */}
        {!isExpanded && notifications.length > 0 && (
          <div className="space-y-2">
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                {getNotificationIcon(notifications[0].type)}
                <span className="font-medium truncate">{notifications[0].title}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{notifications[0].message}</p>
            </div>
            {notifications.length > 1 && (
              <p className="text-xs text-center text-gray-500">
                и еще {notifications.length - 1} уведомлений
              </p>
            )}
          </div>
        )}

        {/* Expanded notifications list */}
        {isExpanded && (
          <div className="space-y-3">
            {notifications.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Последние уведомления</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs h-6 px-2"
                >
                  Очистить все
                </Button>
              </div>
            )}
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет новых уведомлений</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded-lg border transition-all hover:shadow-sm ${
                      notification.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-medium truncate">
                              {notification.title}
                            </h4>
                            {notification.urgent && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                Срочно
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Clock className="h-2 w-2" />
                            {notification.time}
                            {notification.animal && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-2 w-2" />
                                {notification.animal.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearNotification(notification.id)}
                        className="h-5 w-5 p-0 opacity-50 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
