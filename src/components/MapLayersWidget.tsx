
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Map, 
  Layers,
  Eye,
  EyeOff,
  Palette,
  Sun,
  Moon,
  CloudRain,
  Navigation,
  Mountain,
  Building,
  TreePine,
  ChevronDown,
  ChevronUp,
  Compass
} from 'lucide-react';

interface LayerConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  visible: boolean;
  opacity: number;
  category: 'base' | 'overlay' | 'data';
}

export const MapLayersWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeBaseLayer, setActiveBaseLayer] = useState('streets');
  const { toast } = useToast();

  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: 'terrain',
      name: 'Рельеф',
      icon: Mountain,
      visible: false,
      opacity: 80,
      category: 'overlay'
    },
    {
      id: 'buildings',
      name: 'Здания 3D',
      icon: Building,
      visible: true,
      opacity: 70,
      category: 'overlay'
    },
    {
      id: 'vegetation',
      name: 'Растительность',
      icon: TreePine,
      visible: false,
      opacity: 60,
      category: 'overlay'
    },
    {
      id: 'weather',
      name: 'Погода',
      icon: CloudRain,
      visible: false,
      opacity: 50,
      category: 'overlay'
    },
    {
      id: 'navigation',
      name: 'Маршруты',
      icon: Navigation,
      visible: true,
      opacity: 90,
      category: 'data'
    }
  ]);

  const baseLayers = [
    { id: 'streets', name: 'Улицы', icon: Map },
    { id: 'satellite', name: 'Спутник', icon: Sun },
    { id: 'dark', name: 'Темная', icon: Moon },
    { id: 'outdoors', name: 'Природа', icon: Compass }
  ];

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));

    const layer = layers.find(l => l.id === layerId);
    toast({
      title: layer?.visible ? "Слой скрыт" : "Слой показан",
      description: `${layer?.name} ${layer?.visible ? 'отключен' : 'включен'}`,
    });
  };

  const updateLayerOpacity = (layerId: string, opacity: number[]) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity: opacity[0] }
        : layer
    ));
  };

  const changeBaseLayer = (layerId: string) => {
    setActiveBaseLayer(layerId);
    const layer = baseLayers.find(l => l.id === layerId);
    toast({
      title: "Базовый слой изменен",
      description: `Активен слой: ${layer?.name}`,
    });
  };

  const visibleLayers = layers.filter(layer => layer.visible).length;

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-green-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-green-600" />
            <span className="font-medium text-sm">Слои карты</span>
            <Badge variant="secondary" className="text-xs">{visibleLayers}</Badge>
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

        {/* Base Layer Selection */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Базовый слой
          </div>
          <div className="grid grid-cols-2 gap-1">
            {baseLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={activeBaseLayer === layer.id ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => changeBaseLayer(layer.id)}
              >
                <layer.icon className="h-3 w-3 mr-1" />
                {layer.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Layer Toggles */}
        <div className="space-y-2 mb-3">
          {layers.slice(0, isExpanded ? layers.length : 3).map((layer) => (
            <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {layer.visible ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <layer.icon className={`h-4 w-4 ${layer.visible ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{layer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {layer.visible && isExpanded && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{layer.opacity}%</span>
                  </div>
                )}
                <Switch 
                  checked={layer.visible} 
                  onCheckedChange={() => toggleLayer(layer.id)}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Opacity Controls - only show when expanded */}
        {isExpanded && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Прозрачность слоев</div>
            {layers.filter(layer => layer.visible).map((layer) => (
              <div key={`opacity-${layer.id}`} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <layer.icon className="h-3 w-3" />
                    {layer.name}
                  </span>
                  <span className="font-medium">{layer.opacity}%</span>
                </div>
                <Slider
                  value={[layer.opacity]}
                  onValueChange={(value) => updateLayerOpacity(layer.id, value)}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Layer Categories */}
        {isExpanded && (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-gray-700">Категории</div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                Базовые ({baseLayers.length})
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-green-50">
                Наложения ({layers.filter(l => l.category === 'overlay').length})
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-purple-50">
                Данные ({layers.filter(l => l.category === 'data').length})
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => setLayers(prev => prev.map(l => ({ ...l, visible: true })))}
          >
            <Eye className="h-3 w-3 mr-1" />
            Все
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => setLayers(prev => prev.map(l => ({ ...l, visible: false })))}
          >
            <EyeOff className="h-3 w-3 mr-1" />
            Скрыть
          </Button>
        </div>

        {/* Status */}
        <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{visibleLayers} слоев активно</span>
            </div>
            <span className="text-gray-600">Обновлено</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
