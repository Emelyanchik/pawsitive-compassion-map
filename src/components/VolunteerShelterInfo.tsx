
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, Heart, Home, Calendar, Phone } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  location: string;
  specialization: string;
  animalsHelped: number;
  avatar?: string;
  isOnline: boolean;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentAnimals: number;
  type: string;
  contact: string;
}

export const VolunteerShelterInfo: React.FC = () => {
  const volunteers: Volunteer[] = [
    {
      id: '1',
      name: 'Анна Петрова',
      location: 'Москва, Центр',
      specialization: 'Кошки',
      animalsHelped: 15,
      isOnline: true
    },
    {
      id: '2',
      name: 'Михаил Соколов',
      location: 'Санкт-Петербург',
      specialization: 'Собаки',
      animalsHelped: 23,
      isOnline: false
    },
    {
      id: '3',
      name: 'Елена Кузнецова',
      location: 'Екатеринбург',
      specialization: 'Экзотические животные',
      animalsHelped: 8,
      isOnline: true
    }
  ];

  const shelters: Shelter[] = [
    {
      id: '1',
      name: 'Приют "Верные друзья"',
      location: 'Москва, ул. Садовая 25',
      capacity: 50,
      currentAnimals: 42,
      type: 'Собаки и кошки',
      contact: '+7 (495) 123-45-67'
    },
    {
      id: '2',
      name: 'Центр помощи бездомным животным',
      location: 'СПб, пр. Невский 88',
      capacity: 80,
      currentAnimals: 65,
      type: 'Все виды',
      contact: '+7 (812) 987-65-43'
    },
    {
      id: '3',
      name: 'Дом для хвостиков',
      location: 'Екатеринбург, ул. Ленина 12',
      capacity: 30,
      currentAnimals: 28,
      type: 'Кошки',
      contact: '+7 (343) 555-33-22'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Волонтеры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Активные волонтеры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                      <AvatarFallback>
                        {volunteer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {volunteer.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{volunteer.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {volunteer.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {volunteer.specialization}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Heart className="h-3 w-3" />
                    {volunteer.animalsHelped} помощей
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Приюты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Партнерские приюты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shelters.map((shelter) => (
              <div key={shelter.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{shelter.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {shelter.location}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {shelter.type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Вместимость:</span>
                      <span className="ml-2 font-medium">{shelter.capacity} животных</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Сейчас:</span>
                      <span className="ml-2 font-medium">{shelter.currentAnimals} животных</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Заполненность:</span>
                      <span className="ml-2 font-medium">
                        {Math.round((shelter.currentAnimals / shelter.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-gray-600" />
                      <span className="text-gray-600">{shelter.contact}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (shelter.currentAnimals / shelter.capacity) > 0.8 
                        ? 'bg-red-500' 
                        : (shelter.currentAnimals / shelter.capacity) > 0.6 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(shelter.currentAnimals / shelter.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
