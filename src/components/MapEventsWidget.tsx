
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  ChevronRight,
  Star,
  Zap,
  TreePine,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapEvent {
  id: string;
  title: string;
  type: 'rescue' | 'training' | 'cleanup' | 'adoption';
  location: string;
  distance: number;
  time: string;
  participants: number;
  isUrgent?: boolean;
}

export const MapEventsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const [events] = useState<MapEvent[]>([
    {
      id: '1',
      title: 'Спасательная операция',
      type: 'rescue',
      location: 'Парк Сокольники',
      distance: 0.8,
      time: '15:30',
      participants: 5,
      isUrgent: true
    },
    {
      id: '2',
      title: 'Обучение волонтёров',
      type: 'training',
      location: 'Приют "Дружок"',
      distance: 2.1,
      time: '18:00',
      participants: 12
    },
    {
      id: '3',
      title: 'День усыновления',
      type: 'adoption',
      location: 'ТЦ Атриум',
      distance: 1.5,
      time: '12:00',
      participants: 25
    },
    {
      id: '4',
      title: 'Уборка территории',
      type: 'cleanup',
      location: 'Битцевский парк',
      distance: 3.2,
      time: '10:00',
      participants: 8
    }
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rescue':
        return <Zap className="h-3 w-3" />;
      case 'training':
        return <Users className="h-3 w-3" />;
      case 'adoption':
        return <Star className="h-3 w-3" />;
      case 'cleanup':
        return <TreePine className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string, isUrgent?: boolean) => {
    if (isUrgent) return 'bg-red-500';
    
    switch (type) {
      case 'rescue':
        return 'bg-orange-500';
      case 'training':
        return 'bg-blue-500';
      case 'adoption':
        return 'bg-green-500';
      case 'cleanup':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleJoinEvent = (event: MapEvent) => {
    toast({
      title: "Участие в событии",
      description: `Вы записались на "${event.title}"`,
    });
  };

  const handleViewEvent = (event: MapEvent) => {
    toast({
      title: "Показать на карте",
      description: `Переход к месту проведения: ${event.location}`,
    });
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-sm">События рядом</span>
            <Badge variant="secondary" className="text-xs">{events.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-2">
          {events.slice(0, isExpanded ? events.length : 3).map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`p-1.5 rounded-full ${getEventColor(event.type, event.isUrgent)} text-white`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{event.title}</h4>
                      {event.isUrgent && (
                        <Badge variant="destructive" className="text-xs">Срочно</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-2 w-2" />
                        {event.distance} км
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-2 w-2" />
                        {event.participants}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewEvent(event)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-600 mb-2 truncate">{event.location}</div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleJoinEvent(event)}
                  className="flex-1 h-7 text-xs"
                >
                  Участвовать
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewEvent(event)}
                  className="h-7 w-7 p-0"
                >
                  <MapPin className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Filter */}
        {isExpanded && (
          <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded">
            <div className="text-xs font-medium text-gray-700 mb-2">Фильтр событий</div>
            <div className="flex gap-1 flex-wrap">
              {['rescue', 'training', 'adoption', 'cleanup'].map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-purple-100"
                >
                  {type === 'rescue' && 'Спасение'}
                  {type === 'training' && 'Обучение'}
                  {type === 'adoption' && 'Усыновление'}
                  {type === 'cleanup' && 'Уборка'}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-3 text-xs text-center text-gray-500 flex items-center justify-between">
          <span>Сегодня: {events.filter(e => e.isUrgent).length} срочных</span>
          <span>{events.reduce((sum, e) => sum + e.participants, 0)} участников</span>
        </div>
      </CardContent>
    </Card>
  );
};
