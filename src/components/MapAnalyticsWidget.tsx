
import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

export const MapAnalyticsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const userStats = {
    animalsHelped: 23,
    daysActive: 45,
    postsShared: 12,
    volunteersConnected: 8,
    tokensEarned: 450,
    weeklyProgress: 65
  };

  const recentActivities = [
    { action: 'Помог животному', animal: 'Барсик', time: '2 часа назад' },
    { action: 'Пост в Instagram', content: 'История спасения', time: '5 часов назад' },
    { action: 'Связь с волонтером', name: 'Мария К.', time: '1 день назад' }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Моя активность
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
        {/* Quick Stats */}
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

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Недельная цель</span>
            <span>{userStats.weeklyProgress}%</span>
          </div>
          <Progress value={userStats.weeklyProgress} className="h-2" />
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            +15% к прошлой неделе
          </div>
        </div>

        {/* Tokens */}
        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">{userStats.tokensEarned} токенов</span>
          </div>
          <Badge variant="secondary" className="text-xs">+50</Badge>
        </div>

        {/* Recent Activities - only show when expanded */}
        {isExpanded && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">Последние действия</div>
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-gray-600">
                    {activity.animal || activity.content || activity.name}
                  </div>
                </div>
                <div className="text-gray-500">{activity.time}</div>
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
            <Heart className="h-3 w-3 mr-1" />
            Помочь
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
