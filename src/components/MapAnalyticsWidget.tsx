
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Heart, 
  Instagram, 
  Users,
  TrendingUp,
  ChevronRight,
  Award,
  MapPin,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export const MapAnalyticsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveData, setLiveData] = useState({
    activeNow: 12,
    todayHelped: 3,
    onlineVolunteers: 8
  });

  const userStats = {
    animalsHelped: 23,
    daysActive: 45,
    postsShared: 12,
    volunteersConnected: 8,
    tokensEarned: 450,
    weeklyProgress: 65,
    currentStreak: 7,
    monthlyGoal: 30,
    efficiency: 89
  };

  const recentActivities = [
    { 
      action: 'Помог животному', 
      animal: 'Барсик', 
      time: '2 часа назад',
      location: 'Парк Сокольники',
      status: 'completed'
    },
    { 
      action: 'Пост в Instagram', 
      content: 'История спасения', 
      time: '5 часов назад',
      engagement: '+24 лайка',
      status: 'active'
    },
    { 
      action: 'Связь с волонтером', 
      name: 'Мария К.', 
      time: '1 день назад',
      location: 'Центр города',
      status: 'pending'
    }
  ];

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeNow: prev.activeNow + Math.floor(Math.random() * 3) - 1,
        todayHelped: prev.todayHelped + (Math.random() > 0.8 ? 1 : 0),
        onlineVolunteers: prev.onlineVolunteers + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Моя активность
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{liveData.activeNow}</div>
            <div className="text-xs text-gray-600">Активных</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{liveData.todayHelped}</div>
            <div className="text-xs text-gray-600">Сегодня</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{liveData.onlineVolunteers}</div>
            <div className="text-xs text-gray-600">Онлайн</div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <div>
              <div className="text-lg font-bold">{userStats.animalsHelped}</div>
              <div className="text-xs text-gray-600">Помогли</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-purple-500" />
            <div>
              <div className="text-lg font-bold">{userStats.postsShared}</div>
              <div className="text-xs text-gray-600">Постов</div>
            </div>
          </div>
        </div>

        {/* Streak and Efficiency */}
        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">{userStats.currentStreak} дней подряд</span>
          </div>
          <Badge variant="secondary" className="text-xs">{userStats.efficiency}% эффективность</Badge>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Месячная цель ({userStats.animalsHelped}/{userStats.monthlyGoal})</span>
            <span>{Math.round((userStats.animalsHelped / userStats.monthlyGoal) * 100)}%</span>
          </div>
          <Progress value={(userStats.animalsHelped / userStats.monthlyGoal) * 100} className="h-2" />
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            +{userStats.animalsHelped - 18} к прошлому месяцу
          </div>
        </div>

        {/* Tokens */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">{userStats.tokensEarned} токенов</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">+50 сегодня</Badge>
        </div>

        {/* Recent Activities - only show when expanded */}
        {isExpanded && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Последние действия
            </div>
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded border-l-2 border-l-gray-300">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                    <div className="font-medium">{activity.action}</div>
                  </div>
                  <div className="text-gray-600 mt-1">
                    {activity.animal || activity.content || activity.name}
                  </div>
                  {(activity.location || activity.engagement) && (
                    <div className="text-gray-500 text-[10px] mt-1 flex items-center gap-1">
                      {activity.location && (
                        <>
                          <MapPin className="h-2 w-2" />
                          {activity.location}
                        </>
                      )}
                      {activity.engagement && (
                        <span className="text-green-600">{activity.engagement}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-gray-500 text-[10px]">{activity.time}</div>
              </div>
            ))}
          </div>
        )}

        {/* Instagram Status */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Instagram</span>
          </div>
          <Badge className="bg-green-500 text-white text-xs">Подключен</Badge>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Users className="h-3 w-3 mr-1" />
            Волонтеры
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Target className="h-3 w-3 mr-1" />
            Цели
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
