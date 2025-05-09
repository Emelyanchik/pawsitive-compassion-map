
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Dog, Cat, Bookmark, X, Heart, AlertCircle, Eye } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SavedAnimalsPanelProps {
  open: boolean;
  onClose: () => void;
}

const SavedAnimalsPanel: React.FC<SavedAnimalsPanelProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  // Mock saved animals - in a real application, this would come from user state
  const savedAnimals = [
    {
      id: 'saved-1',
      name: 'Max',
      type: 'dog',
      status: 'needs_help',
      savedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      latitude: 40.712776,
      longitude: -74.005974,
      description: 'Golden retriever, limping, seems hungry',
    },
    {
      id: 'saved-2',
      name: 'Whiskers',
      type: 'cat',
      status: 'being_helped',
      savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      latitude: 40.730610,
      longitude: -73.935242,
      description: 'Gray tabby, friendly but scared',
    },
    {
      id: 'saved-3',
      name: 'Buddy',
      type: 'dog',
      status: 'reported',
      savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      latitude: 40.741895,
      longitude: -73.989308,
      description: 'Small dog, possibly lost, has collar',
    }
  ];
  
  const handleRemove = (id: string) => {
    toast({
      title: "Animal Removed",
      description: "The animal has been removed from your saved list",
    });
  };
  
  const handleViewOnMap = (latitude: number, longitude: number) => {
    onClose();
    // This would ideally fly to the location on the map and select the animal
    toast({
      title: "Viewing on Map",
      description: `Centering map on coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    });
  };
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <SheetTitle>Saved Animals</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            View and manage animals you're tracking or interested in
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Saved ({savedAnimals.length})</TabsTrigger>
            <TabsTrigger value="dogs">Dogs ({savedAnimals.filter(a => a.type === 'dog').length})</TabsTrigger>
            <TabsTrigger value="cats">Cats ({savedAnimals.filter(a => a.type === 'cat').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-4">
                {savedAnimals.length > 0 ? (
                  savedAnimals.map(animal => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      onRemove={() => handleRemove(animal.id)}
                      onView={() => handleViewOnMap(animal.latitude, animal.longitude)}
                    />
                  ))
                ) : (
                  <EmptyState message="You haven't saved any animals yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="dogs" className="mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-4">
                {savedAnimals.filter(a => a.type === 'dog').length > 0 ? (
                  savedAnimals.filter(a => a.type === 'dog').map(animal => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      onRemove={() => handleRemove(animal.id)}
                      onView={() => handleViewOnMap(animal.latitude, animal.longitude)}
                    />
                  ))
                ) : (
                  <EmptyState message="You haven't saved any dogs yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="cats" className="mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-4">
                {savedAnimals.filter(a => a.type === 'cat').length > 0 ? (
                  savedAnimals.filter(a => a.type === 'cat').map(animal => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      onRemove={() => handleRemove(animal.id)}
                      onView={() => handleViewOnMap(animal.latitude, animal.longitude)}
                    />
                  ))
                ) : (
                  <EmptyState message="You haven't saved any cats yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-auto pt-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface AnimalCardProps {
  animal: any;
  onRemove: () => void;
  onView: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onRemove, onView }) => {
  const statusColors = {
    needs_help: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    being_helped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    reported: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    adopted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };
  
  return (
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {animal.type === 'dog' ? (
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Dog className="w-6 h-6 text-orange-500" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Cat className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{animal.name}</h3>
            <Badge 
              className={`capitalize ${statusColors[animal.status as keyof typeof statusColors]}`}
            >
              {animal.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {animal.description}
          </p>
          
          <div className="text-xs text-muted-foreground mt-2">
            Saved {formatDistanceToNow(animal.savedAt)} ago
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex items-center justify-between mt-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onView}>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View on Map
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={onRemove}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
      <Bookmark className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="font-medium mb-2">{message}</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Save animals by clicking the bookmark icon on any animal's details page
    </p>
  </div>
);

export default SavedAnimalsPanel;
