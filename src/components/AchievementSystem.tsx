
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Heart, Shield, Star, Trophy, Target, Users, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  reward: string;
  category: 'rescue' | 'social' | 'time' | 'impact';
}

interface AchievementSystemProps {
  userStats: {
    animalsHelped: number;
    daysActive: number;
    postsShared: number;
    volunteersConnected: number;
  };
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ userStats }) => {
  const achievements: Achievement[] = [
    {
      id: 'first_rescue',
      title: 'Первый спасатель',
      description: 'Помогите своему первому животному',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      progress: Math.min(userStats.animalsHelped, 1),
      maxProgress: 1,
      isCompleted: userStats.animalsHelped >= 1,
      reward: '50 токенов',
      category: 'rescue'
    },
    {
      id: 'animal_guardian',
      title: 'Защитник животных',
      description: 'Помогите 10 животным',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      progress: Math.min(userStats.animalsHelped, 10),
      maxProgress: 10,
      isCompleted: userStats.animalsHelped >= 10,
      reward: '200 токенов',
      category: 'rescue'
    },
    {
      id: 'hero_rescuer',
      title: 'Герой-спасатель',
      description: 'Помогите 25 животным',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      progress: Math.min(userStats.animalsHelped, 25),
      maxProgress: 25,
      isCompleted: userStats.animalsHelped >= 25,
      reward: '500 токенов + Особый значок',
      category: 'rescue'
    },
    {
      id: 'week_warrior',
      title: 'Недельный воин',
      description: 'Будьте активны 7 дней подряд',
      icon: <Target className="h-6 w-6 text-green-500" />,
      progress: Math.min(userStats.daysActive, 7),
      maxProgress: 7,
      isCompleted: userStats.daysActive >= 7,
      reward: '100 токенов',
      category: 'time'
    },
    {
      id: 'social_ambassador',
      title: 'Социальный амбассадор',
      description: 'Поделитесь 5 историями в Instagram',
      icon: <Star className="h-6 w-6 text-purple-500" />,
      progress: Math.min(userStats.postsShared, 5),
      maxProgress: 5,
      isCompleted: userStats.postsShared >= 5,
      reward: '150 токенов',
      category: 'social'
    },
    {
      id: 'community_builder',
      title: 'Строитель сообщества',
      description: 'Подключитесь к 3 волонтерам',
      icon: <Users className="h-6 w-6 text-orange-500" />,
      progress: Math.min(userStats.volunteersConnected, 3),
      maxProgress: 3,
      isCompleted: userStats.volunteersConnected >= 3,
      reward: '120 токенов',
      category: 'social'
    }
  ];

  const categoryColors = {
    rescue: 'bg-red-100 text-red-800',
    social: 'bg-purple-100 text-purple-800',
    time: 'bg-green-100 text-green-800',
    impact: 'bg-blue-100 text-blue-800'
  };

  const completedAchievements = achievements.filter(a => a.isCompleted).length;
  const totalRewards = achievements
    .filter(a => a.isCompleted)
    .reduce((sum, a) => sum + parseInt(a.reward.match(/\d+/)?.[0] || '0'), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Система достижений
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Завершено: {completedAchievements}/{achievements.length}</span>
          <span>•</span>
          <span>Заработано: {totalRewards} токенов</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border transition-all ${
                achievement.isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={categoryColors[achievement.category]}
                      >
                        {achievement.category}
                      </Badge>
                      {achievement.isCompleted && (
                        <Badge className="bg-green-500 text-white">Завершено</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Прогресс: {achievement.progress}/{achievement.maxProgress}</span>
                      <span className="text-yellow-600">Награда: {achievement.reward}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className={`h-2 ${achievement.isCompleted ? 'bg-green-200' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
