
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  SOS, 
  Users, 
  Search,
  MapPin,
  Camera,
  Share,
  Phone,
  MessageSquare,
  Heart,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const MapQuickActionsWidget: React.FC = () => {
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [emergencyReport, setEmergencyReport] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();

  const quickActions = [
    {
      id: 'emergency',
      title: 'SOS',
      description: 'Экстренная помощь',
      icon: SOS,
      color: 'bg-red-500',
      urgent: true
    },
    {
      id: 'find_volunteers',
      title: 'Волонтеры',
      description: 'Найти помощь',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'quick_search',
      title: 'Поиск',
      description: 'Найти животных',
      icon: Search,
      color: 'bg-green-500'
    },
    {
      id: 'add_location',
      title: 'Местоположение',
      description: 'Отметить место',
      icon: MapPin,
      color: 'bg-purple-500'
    }
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'emergency':
        setEmergencyDialogOpen(true);
        break;
      case 'find_volunteers':
        toast({
          title: "Поиск волонтеров",
          description: "Ищем ближайших активных волонтеров...",
        });
        break;
      case 'quick_search':
        toast({
          title: "Быстрый поиск",
          description: "Показываем животных в радиусе 2 км...",
        });
        break;
      case 'add_location':
        toast({
          title: "Добавить место",
          description: "Нажмите на карту, чтобы отметить место.",
        });
        break;
    }
  };

  const handleEmergencyReport = async () => {
    if (!emergencyReport.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, опишите ситуацию.",
        variant: "destructive",
      });
      return;
    }

    setIsReporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmergencyDialogOpen(false);
      setEmergencyReport('');
      
      toast({
        title: "SOS отправлен!",
        description: "Экстренный сигнал отправлен всем волонтерам в округе.",
      });
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сигнал. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-orange-600" />
          <span className="font-medium text-sm">Быстрые действия</span>
          <Badge variant="secondary" className="text-xs">4</Badge>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform ${
                action.urgent ? 'border-red-300 hover:border-red-400' : ''
              }`}
              onClick={() => handleQuickAction(action.id)}
            >
              <div className={`p-1.5 rounded-full ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{action.title}</span>
              <span className="text-xs text-gray-500">{action.description}</span>
            </Button>
          ))}
        </div>

        {/* Additional Quick Tools */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Дополнительные инструменты</div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Camera className="h-3 w-3 mr-1" />
              Фото
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Share className="h-3 w-3 mr-1" />
              Поделиться
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Связаться
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Чат
            </Button>
          </div>
        </div>

        {/* Live Activity Indicator */}
        <div className="mt-4 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">5 волонтеров онлайн</span>
            </div>
            <ChevronRight className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Средний ответ: 3 минуты
          </div>
        </div>

        {/* Emergency Dialog */}
        <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Экстренная ситуация
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
                  <SOS className="h-4 w-4" />
                  Сигнал SOS
                </div>
                <p className="text-xs text-red-600">
                  Этот сигнал будет отправлен всем волонтерам в радиусе 5 км. 
                  Используйте только в критических ситуациях.
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Опишите ситуацию
                </label>
                <Textarea
                  placeholder="Краткое описание экстренной ситуации..."
                  value={emergencyReport}
                  onChange={(e) => setEmergencyReport(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEmergencyDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleEmergencyReport} 
                  disabled={isReporting}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isReporting ? (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <SOS className="h-4 w-4 mr-2" />
                      Отправить SOS
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
