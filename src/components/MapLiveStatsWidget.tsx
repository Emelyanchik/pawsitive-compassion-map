
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Heart,
  MapPin,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LiveStats {
  activeUsers: number;
  animalsHelped: number;
  onlineVolunteers: number;
  recentReports: number;
  averageResponseTime: number;
  successRate: number;
}

export const MapLiveStatsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<LiveStats>({
    activeUsers: 45,
    animalsHelped: 12,
    onlineVolunteers: 8,
    recentReports: 5,
    averageResponseTime: 12,
    successRate: 87
  });

  const [trends, setTrends] = useState({
    activeUsers: '+12%',
    animalsHelped: '+8%',
    onlineVolunteers: '-2%',
    recentReports: '+25%'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 6) - 3,
        animalsHelped: prev.animalsHelped + (Math.random() > 0.9 ? 1 : 0),
        onlineVolunteers: Math.max(1, prev.onlineVolunteers + Math.floor(Math.random() * 4) - 2),
        recentReports: prev.recentReports + (Math.random() > 0.8 ? 1 : 0),
        averageResponseTime: Math.max(5, prev.averageResponseTime + Math.floor(Math.random() * 4) - 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-green-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="font-medium text-sm">Статистика</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-700">{stats.activeUsers}</div>
                <div className="text-xs text-blue-600">Активных</div>
              </div>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor(trends.activeUsers)}`}>
              {getTrendIcon(trends.activeUsers)}
              {trends.activeUsers}
            </div>
          </div>

          <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-red-700">{stats.animalsHelped}</div>
                <div className="text-xs text-red-600">Спасено</div>
              </div>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <div className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor(trends.animalsHelped)}`}>
              {getTrendIcon(trends.animalsHelped)}
              {trends.animalsHelped}
            </div>
          </div>

          <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-purple-700">{stats.onlineVolunteers}</div>
                <div className="text-xs text-purple-600">Волонтеров</div>
              </div>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
            <div className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor(trends.onlineVolunteers)}`}>
              {getTrendIcon(trends.onlineVolunteers)}
              {trends.onlineVolunteers}
            </div>
          </div>

          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-orange-700">{stats.recentReports}</div>
                <div className="text-xs text-orange-600">Сообщений</div>
              </div>
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <div className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor(trends.recentReports)}`}>
              {getTrendIcon(trends.recentReports)}
              {trends.recentReports}
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="p-2 bg-gray-50 rounded-lg mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Среднее время ответа
            </span>
            <span className="font-medium">{stats.averageResponseTime} мин</span>
          </div>
          <div className="text-xs text-gray-600">
            {stats.averageResponseTime <= 15 ? '🟢 Отлично' : stats.averageResponseTime <= 30 ? '🟡 Хорошо' : '🔴 Медленно'}
          </div>
        </div>

        {/* Success Rate */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span>Успешность помощи</span>
            <span className="font-medium">{stats.successRate}%</span>
          </div>
          <Progress value={stats.successRate} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Цель: 85%</span>
            <span className={stats.successRate >= 85 ? 'text-green-600' : 'text-orange-600'}>
              {stats.successRate >= 85 ? '✓ Достигнута' : '↗ Улучшаем'}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-700">Детальная статистика</div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="h-2 w-2" />
                  Просмотров карты
                </span>
                <span className="font-medium">2,845</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>Новых пользователей</span>
                <span className="font-medium text-green-600">+23</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>Активных регионов</span>
                <span className="font-medium">12</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>Средний онлайн</span>
                <span className="font-medium">{Math.round(stats.activeUsers * 0.7)}</span>
              </div>
            </div>

            <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded text-xs">
              <div className="font-medium text-gray-700 mb-1">🎯 Сегодняшние цели:</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Помочь животным: 15</span>
                  <span className={stats.animalsHelped >= 15 ? 'text-green-600' : 'text-orange-600'}>
                    {stats.animalsHelped}/15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Новые волонтеры: 3</span>
                  <span className="text-blue-600">2/3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Footer */}
        <div className="mt-3 text-xs text-center text-gray-500">
          Обновлено {new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </CardContent>
    </Card>
  );
};
