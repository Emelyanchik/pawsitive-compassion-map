
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Heart, 
  Star, 
  Award,
  Activity,
  Users,
  MapPin
} from 'lucide-react';

interface ActivityData {
  date: string;
  animals_helped: number;
  posts_shared: number;
  volunteer_hours: number;
}

interface ImpactMetric {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export const UserActivityAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Моковые данные активности
  const weeklyData: ActivityData[] = [
    { date: 'Пн', animals_helped: 2, posts_shared: 1, volunteer_hours: 3 },
    { date: 'Вт', animals_helped: 1, posts_shared: 2, volunteer_hours: 2 },
    { date: 'Ср', animals_helped: 3, posts_shared: 0, volunteer_hours: 4 },
    { date: 'Чт', animals_helped: 0, posts_shared: 1, volunteer_hours: 1 },
    { date: 'Пт', animals_helped: 2, posts_shared: 3, volunteer_hours: 5 },
    { date: 'Сб', animals_helped: 4, posts_shared: 2, volunteer_hours: 6 },
    { date: 'Вс', animals_helped: 1, posts_shared: 1, volunteer_hours: 2 }
  ];

  const impactMetrics: ImpactMetric[] = [
    {
      label: 'Спасенные животные',
      value: 23,
      change: +15,
      icon: <Heart className="h-4 w-4" />,
      color: 'text-red-600'
    },
    {
      label: 'Часы волонтерства',
      value: 45,
      change: +8,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Посты в соцсетях',
      value: 12,
      change: +25,
      icon: <Star className="h-4 w-4" />,
      color: 'text-yellow-600'
    },
    {
      label: 'Связи с волонтерами',
      value: 8,
      change: +33,
      icon: <Users className="h-4 w-4" />,
      color: 'text-green-600'
    }
  ];

  const activityTypes = [
    { name: 'Спасение животных', value: 40, color: '#ef4444' },
    { name: 'Волонтерство', value: 30, color: '#3b82f6' },
    { name: 'Социальная активность', value: 20, color: '#eab308' },
    { name: 'Обучение', value: 10, color: '#22c55e' }
  ];

  const goals = [
    { name: 'Помочь 50 животным', current: 23, target: 50, color: 'bg-red-500' },
    { name: '100 часов волонтерства', current: 45, target: 100, color: 'bg-blue-500' },
    { name: '25 постов в Instagram', current: 12, target: 25, color: 'bg-purple-500' },
    { name: 'Связь с 15 волонтерами', current: 8, target: 15, color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Основные метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <Badge 
                  variant={metric.change > 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-gray-600">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={timeRange} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График активности */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Активность по дням
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="animals_helped" fill="#ef4444" name="Животные" />
                    <Bar dataKey="posts_shared" fill="#3b82f6" name="Посты" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Распределение активности */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Распределение времени
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={activityTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {activityTypes.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {activityTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm">{type.name}: {type.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Прогресс целей */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Прогресс целей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.name}</span>
                      <span className="text-xs text-gray-600">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">
                      {Math.round((goal.current / goal.target) * 100)}% завершено
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
