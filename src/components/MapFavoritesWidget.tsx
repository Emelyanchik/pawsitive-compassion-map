
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Navigation,
  Clock,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';

interface FavoriteLocation {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: 'shelter' | 'park' | 'vet' | 'volunteer' | 'other';
  createdAt: string;
  visitCount: number;
}

export const MapFavoritesWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [addLocationDialog, setAddLocationDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationDescription, setNewLocationDescription] = useState('');
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<FavoriteLocation[]>([
    {
      id: '1',
      name: 'Приют "Верные друзья"',
      description: 'Основной приют для кошек и собак',
      coordinates: [37.6173, 55.7558],
      category: 'shelter',
      createdAt: '2024-01-15',
      visitCount: 12
    },
    {
      id: '2',
      name: 'Парк Сокольники',
      description: 'Место частых находок животных',
      coordinates: [37.6742, 55.7887],
      category: 'park',
      createdAt: '2024-02-20',
      visitCount: 8
    },
    {
      id: '3',
      name: 'Ветклиника "Айболит"',
      description: 'Круглосуточная помощь животным',
      coordinates: [37.5983, 55.7887],
      category: 'vet',
      createdAt: '2024-03-10',
      visitCount: 5
    }
  ]);

  const categoryIcons = {
    shelter: <Bookmark className="h-3 w-3" />,
    park: <MapPin className="h-3 w-3" />,
    vet: <Plus className="h-3 w-3" />,
    volunteer: <Star className="h-3 w-3" />,
    other: <MapPin className="h-3 w-3" />
  };

  const categoryColors = {
    shelter: 'bg-blue-500',
    park: 'bg-green-500',
    vet: 'bg-red-500',
    volunteer: 'bg-purple-500',
    other: 'bg-gray-500'
  };

  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название места",
        variant: "destructive",
      });
      return;
    }

    const newLocation: FavoriteLocation = {
      id: Date.now().toString(),
      name: newLocationName,
      description: newLocationDescription,
      coordinates: [37.6173, 55.7558], // Default coordinates
      category: 'other',
      createdAt: new Date().toISOString().split('T')[0],
      visitCount: 0
    };

    setFavorites(prev => [newLocation, ...prev]);
    setNewLocationName('');
    setNewLocationDescription('');
    setAddLocationDialog(false);

    toast({
      title: "Место добавлено",
      description: `${newLocation.name} добавлено в избранное`,
    });
  };

  const handleNavigateToLocation = (location: FavoriteLocation) => {
    setFavorites(prev => prev.map(fav => 
      fav.id === location.id 
        ? { ...fav, visitCount: fav.visitCount + 1 }
        : fav
    ));

    toast({
      title: "Навигация",
      description: `Переход к ${location.name}`,
    });
  };

  const handleRemoveLocation = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
    toast({
      title: "Место удалено",
      description: "Место удалено из избранного",
    });
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg border-l-4 border-l-yellow-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-sm">Избранные места</span>
            <Badge variant="secondary" className="text-xs">{favorites.length}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Dialog open={addLocationDialog} onOpenChange={setAddLocationDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить место в избранное</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Название места</Label>
                    <Input
                      id="name"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="Введите название..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Input
                      id="description"
                      value={newLocationDescription}
                      onChange={(e) => setNewLocationDescription(e.target.value)}
                      placeholder="Краткое описание места..."
                    />
                  </div>
                  <Button onClick={handleAddLocation} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить место
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Quick Access - Top 3 places */}
        {!isExpanded && (
          <div className="space-y-2">
            {favorites.slice(0, 3).map((location) => (
              <div key={location.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`p-1 rounded-full ${categoryColors[location.category]} text-white`}>
                    {categoryIcons[location.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{location.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-2 w-2" />
                      {location.visitCount} посещений
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateToLocation(location)}
                  className="h-6 w-6 p-0"
                >
                  <Navigation className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {favorites.length > 3 && (
              <p className="text-xs text-center text-gray-500">
                и еще {favorites.length - 3} мест
              </p>
            )}
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {favorites.map((location) => (
                <div key={location.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`p-1.5 rounded-full ${categoryColors[location.category]} text-white`}>
                        {categoryIcons[location.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{location.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{location.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigateToLocation(location)}
                        className="h-6 w-6 p-0"
                      >
                        <Navigation className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocation(location.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Добавлено: {location.createdAt}</span>
                    <span>{location.visitCount} посещений</span>
                  </div>
                </div>
              ))}
            </div>

            {favorites.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Нет избранных мест</p>
                <p className="text-xs">Добавьте важные места для быстрого доступа</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">{favorites.length} избранных мест</span>
            </div>
            <span className="text-gray-600">
              {favorites.reduce((sum, fav) => sum + fav.visitCount, 0)} всего посещений
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
