
import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Heart, PawPrint, Clock } from 'lucide-react';
import AnimalDetailsDialog from './AnimalDetailsDialog';

const AnimalListView = () => {
  const { filteredAnimals, setSelectedAnimal } = useMap();
  const [animalDetailsOpen, setAnimalDetailsOpen] = React.useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = React.useState<string | null>(null);

  const handleAnimalClick = (animalId: string) => {
    const animal = filteredAnimals.find(a => a.id === animalId);
    if (animal) {
      setSelectedAnimal(animal);
      setSelectedAnimalId(animalId);
      setAnimalDetailsOpen(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      needs_help: { color: 'destructive', label: 'Needs Help' },
      being_helped: { color: 'warning', label: 'Being Helped' },
      adopted: { color: 'success', label: 'Adopted' },
      reported: { color: 'purple', label: 'Reported' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
    
    return <Badge variant={config.color as any}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'cat') return <PawPrint className="h-4 w-4 text-petmap-green" />;
    if (type === 'dog') return <PawPrint className="h-4 w-4 text-petmap-orange" />;
    return <PawPrint className="h-4 w-4" />;
  };

  if (filteredAnimals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <PawPrint className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">No animals found</h3>
        <p className="text-gray-500 text-center mt-2">
          Try changing your filters or zooming out on the map
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Animals Near You</h2>
            <p className="text-sm text-gray-500">{filteredAnimals.length} animals found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnimals.map((animal) => (
              <div 
                key={animal.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                onClick={() => handleAnimalClick(animal.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{animal.name}</h3>
                  {getStatusBadge(animal.status)}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  {getTypeIcon(animal.type)}
                  <span className="capitalize">{animal.type}</span>
                  <span className="text-gray-300">•</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{animal.reportDate}</span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {animal.description}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnimalClick(animal.id);
                    }}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    <span>Details</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-rose-500"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      // Save functionality would go here
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <AnimalDetailsDialog 
        open={animalDetailsOpen} 
        onOpenChange={setAnimalDetailsOpen} 
      />
    </div>
  );
};

export default AnimalListView;
