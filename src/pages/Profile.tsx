
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Heart, 
  Settings, 
  Edit,
  Star,
  Award,
  Activity,
  Instagram
} from 'lucide-react';
import { InstagramIntegration } from '@/components/InstagramIntegration';
import { AchievementSystem } from '@/components/AchievementSystem';
import { UserActivityAnalytics } from '@/components/UserActivityAnalytics';
import { InteractiveAnimalCard } from '@/components/InteractiveAnimalCard';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: 'Анна Волонтер',
    email: 'anna@volunteer.com',
    avatar: '/placeholder.svg',
    location: 'Москва, Россия',
    joinDate: '2023-03-15',
    stats: {
      animalsHelped: 23,
      daysActive: 45,
      postsShared: 12,
      volunteersConnected: 8,
      tokensEarned: 450,
      level: 5
    },
    shelters: [
      {
        id: '1',
        name: 'Приют "Добрые руки"',
        location: 'ул. Ленина, 15, Москва',
        animalsCount: 85,
        capacity: 120,
        type: 'mixed',
        distance: 2.3
      },
      {
        id: '2',
        name: 'Центр помощи животным',
        location: 'пр. Мира, 42, Москва', 
        animalsCount: 67,
        capacity: 80,
        type: 'cats',
        distance: 4.1
      }
    ]
  };

  // Mock recent animals
  const recentAnimals = [
    {
      id: '1',
      name: 'Барсик',
      type: 'cat' as const,
      status: 'needs_help' as const,
      description: 'Найден на улице, нуждается в медицинской помощи',
      location: 'Парк Сокольники, Москва',
      reportedBy: 'Мария К.',
      reportedAt: '2024-01-15T10:30:00Z',
      urgency: 'medium' as const,
      helpProgress: 65,
      volunteersInvolved: 3,
      estimatedCost: 150,
      latitude: 55.7558,
      longitude: 37.6176
    },
    {
      id: '2', 
      name: 'Рекс',
      type: 'dog' as const,
      status: 'being_helped' as const,
      description: 'Бездомная собака, дружелюбная, ищет дом',
      location: 'ул. Арбат, Москва',
      reportedBy: 'Алексей М.',
      reportedAt: '2024-01-12T14:20:00Z',
      urgency: 'low' as const,
      helpProgress: 80,
      volunteersInvolved: 5,
      estimatedCost: 200,
      latitude: 55.7522,
      longitude: 37.5929
    }
  ];

  const handleHelp = (animalId: string) => {
    console.log('Offering help for animal:', animalId);
  };

  const handleShare = (animalId: string) => {
    console.log('Sharing animal story:', animalId);
  };

  const handleContact = (animalId: string) => {
    console.log('Contacting about animal:', animalId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-gray-600">{userData.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    С {new Date(userData.joinDate).toLocaleDateString('ru-RU')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Уровень {userData.stats.level}
                  </span>
                </div>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.animalsHelped}</div>
              <p className="text-sm text-gray-600">Помогли животным</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.daysActive}</div>
              <p className="text-sm text-gray-600">Дней активности</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Instagram className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.postsShared}</div>
              <p className="text-sm text-gray-600">Постов в соцсетях</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.tokensEarned}</div>
              <p className="text-sm text-gray-600">Токенов заработано</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="animals">Животные</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volunteer Shelters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Приюты волонтера
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.shelters.map((shelter) => (
                    <div key={shelter.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{shelter.name}</h4>
                        <Badge variant="outline">{shelter.distance} км</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{shelter.location}</p>
                      <div className="flex justify-between text-sm">
                        <span>Животных: {shelter.animalsCount}/{shelter.capacity}</span>
                        <span>Тип: {shelter.type === 'mixed' ? 'Смешанный' : shelter.type === 'cats' ? 'Кошки' : 'Собаки'}</span>
                      </div>
                      <Progress 
                        value={(shelter.animalsCount / shelter.capacity) * 100} 
                        className="mt-2 h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Instagram Integration */}
              <InstagramIntegration />
            </div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Недавние животные</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentAnimals.map((animal) => (
                    <InteractiveAnimalCard
                      key={animal.id}
                      animal={animal}
                      onHelp={handleHelp}
                      onShare={handleShare}
                      onContact={handleContact}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem userStats={userData.stats} />
          </TabsContent>

          <TabsContent value="analytics">
            <UserActivityAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Настройки профиля
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Настройки профиля будут добавлены в следующих обновлениях.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
