
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Layers, 
  MapPin, 
  Filter,
  Eye,
  EyeOff,
  Settings,
  Circle,
  Square,
  Triangle,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const MapClusterControlWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clusterRadius, setClusterRadius] = useState([50]);
  const [minPoints, setMinPoints] = useState([2]);
  const [showClusters, setShowClusters] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [animateTransitions, setAnimateTransitions] = useState(true);
  const { toast } = useToast();

  const clusterStats = {
    totalClusters: 8,
    averageSize: 4.2,
    largestCluster: 12,
    unclustered: 3
  };

  const handleClusterRadiusChange = (value: number[]) => {
    setClusterRadius(value);
    toast({
      title: "Радиус кластеризации изменен",
      description: `Новый радиус: ${value[0]}px`,
    });
  };

  const handleMinPointsChange = (value: number[]) => {
    setMinPoints(value);
    toast({
      title: "Минимум точек изменен",
      description: `Минимум для кластера: ${value[0]} животных`,
    });
  };

  const toggleClusters = () => {
    setShowClusters(!showClusters);
    toast({
      title: showClusters ? "Кластеры скрыты" : "Кластеры показаны",
      description: showClusters ? "Показаны отдельные маркеры" : "Включена кластеризация",
    });
  };

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
    toast({
      title: showHeatmap ? "Тепловая карта отключена" : "Тепловая карта включена",
      description: showHeatmap ? "Обычный режим просмотра" : "Показана плотность животных",
    });
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-indigo-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-sm">Управление кластерами</span>
            <Badge variant="secondary" className="text-xs">{clusterStats.totalClusters}</Badge>
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
        <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-indigo-600">{clusterStats.totalClusters}</div>
            <div className="text-xs text-gray-600">Кластеров</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-purple-600">{clusterStats.averageSize}</div>
            <div className="text-xs text-gray-600">Средний</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-600">{clusterStats.largestCluster}</div>
            <div className="text-xs text-gray-600">Макс</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-orange-600">{clusterStats.unclustered}</div>
            <div className="text-xs text-gray-600">Один</div>
          </div>
        </div>

        {/* Quick Toggle Controls */}
        <div className="space-y-3 mb-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {showClusters ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
              <span className="text-sm font-medium">Кластеризация</span>
            </div>
            <Switch checked={showClusters} onCheckedChange={toggleClusters} />
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Circle className={`h-4 w-4 ${showHeatmap ? 'text-red-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Тепловая карта</span>
            </div>
            <Switch checked={showHeatmap} onCheckedChange={toggleHeatmap} />
          </div>
        </div>

        {/* Advanced Controls - only show when expanded */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Настройки кластеризации
            </div>
            
            {/* Cluster Radius Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Радиус кластеризации</span>
                <span className="font-medium">{clusterRadius[0]}px</span>
              </div>
              <Slider
                value={clusterRadius}
                onValueChange={handleClusterRadiusChange}
                max={100}
                min={20}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Близко</span>
                <span>Далеко</span>
              </div>
            </div>

            {/* Minimum Points Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Минимум для кластера</span>
                <span className="font-medium">{minPoints[0]} животных</span>
              </div>
              <Slider
                value={minPoints}
                onValueChange={handleMinPointsChange}
                max={10}
                min={2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Меньше</span>
                <span>Больше</span>
              </div>
            </div>

            {/* Animation Toggle */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className={`h-4 w-4 ${animateTransitions ? 'text-yellow-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Анимации</span>
              </div>
              <Switch checked={animateTransitions} onCheckedChange={setAnimateTransitions} />
            </div>

            {/* Cluster Shape Options */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">Форма кластеров</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Circle className="h-3 w-3 mr-1" />
                  Круг
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Square className="h-3 w-3 mr-1" />
                  Квадрат
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Triangle className="h-3 w-3 mr-1" />
                  Треугольник
                </Button>
              </div>
            </div>

            {/* Filter by Cluster Size */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Фильтр по размеру
              </div>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                  1-3 животных
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                  4-8 животных
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                  9+ животных
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            Центр карты
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Сброс
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Кластеризация активна</span>
            </div>
            <span className="text-gray-600">Обновлено только что</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
