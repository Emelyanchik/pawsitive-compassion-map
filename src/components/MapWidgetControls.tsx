
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Instagram, 
  Bell, 
  Zap, 
  Layers, 
  Heart, 
  Activity, 
  UserPlus, 
  Calendar,
  MousePointer 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapWidgetControlsProps {
  widgetVisibility: {
    analytics: boolean;
    instagram: boolean;
    notifications: boolean;
    quickActions: boolean;
    clusterControl: boolean;
    layers: boolean;
    favorites: boolean;
    liveStats: boolean;
    userActions: boolean;
    events: boolean;
  };
  onToggleWidget: (widgetName: keyof MapWidgetControlsProps['widgetVisibility']) => void;
}

const MapWidgetControls: React.FC<MapWidgetControlsProps> = ({
  widgetVisibility,
  onToggleWidget
}) => {
  const { toast } = useToast();

  const widgets = [
    {
      key: 'analytics' as const,
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Аналитика',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      key: 'instagram' as const,
      icon: <Instagram className="h-4 w-4" />,
      label: 'Instagram',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      key: 'notifications' as const,
      icon: <Bell className="h-4 w-4" />,
      label: 'Уведомления',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      key: 'quickActions' as const,
      icon: <Zap className="h-4 w-4" />,
      label: 'Быстрые действия',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      key: 'layers' as const,
      icon: <Layers className="h-4 w-4" />,
      label: 'Слои',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      key: 'favorites' as const,
      icon: <Heart className="h-4 w-4" />,
      label: 'Избранное',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    {
      key: 'liveStats' as const,
      icon: <Activity className="h-4 w-4" />,
      label: 'Live статистика',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100'
    },
    {
      key: 'userActions' as const,
      icon: <UserPlus className="h-4 w-4" />,
      label: 'Мои действия',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      key: 'events' as const,
      icon: <Calendar className="h-4 w-4" />,
      label: 'События',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      key: 'clusterControl' as const,
      icon: <MousePointer className="h-4 w-4" />,
      label: 'Кластеры',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    }
  ];

  const handleToggleWidget = (widgetKey: keyof MapWidgetControlsProps['widgetVisibility'], label: string) => {
    onToggleWidget(widgetKey);
    
    const isVisible = widgetVisibility[widgetKey];
    toast({
      title: isVisible ? `${label} скрыт` : `${label} показан`,
      description: isVisible ? 'Виджет убран с карты' : 'Виджет добавлен на карту',
    });
  };

  return (
    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Виджеты карты:</span>
        {widgets.map((widget) => (
          <Button
            key={widget.key}
            variant="ghost"
            size="sm"
            onClick={() => handleToggleWidget(widget.key, widget.label)}
            className={`h-8 px-2 flex items-center gap-1 transition-all ${
              widgetVisibility[widget.key] 
                ? `${widget.bgColor} ${widget.color} border border-current` 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title={`${widgetVisibility[widget.key] ? 'Скрыть' : 'Показать'} ${widget.label}`}
          >
            {widget.icon}
            <span className="text-xs hidden sm:inline">{widget.label}</span>
            {widgetVisibility[widget.key] && (
              <div className="w-1.5 h-1.5 bg-current rounded-full ml-1" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MapWidgetControls;
