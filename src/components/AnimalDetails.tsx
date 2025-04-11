
import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X, MapPin, Calendar, Heart, DollarSign, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AnimalDetails = () => {
  const { selectedAnimal, setSelectedAnimal, updateAnimalStatus } = useMap();
  const { toast } = useToast();

  if (!selectedAnimal) return null;

  const handleStatusUpdate = (status: 'needs_help' | 'being_helped' | 'adopted' | 'reported') => {
    updateAnimalStatus(selectedAnimal.id, status);
    toast({
      title: 'Status Updated',
      description: `${selectedAnimal.name}'s status has been updated.`,
    });
  };

  // Get status badge color
  const getStatusBadge = () => {
    switch (selectedAnimal.status) {
      case 'needs_help':
        return <Badge variant="destructive">Needs Help</Badge>;
      case 'being_helped':
        return <Badge className="bg-petmap-orange">Being Helped</Badge>;
      case 'adopted':
        return <Badge className="bg-petmap-green">Adopted</Badge>;
      case 'reported':
        return <Badge className="bg-petmap-purple">Reported</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0" 
        onClick={() => setSelectedAnimal(null)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h2 className="text-xl font-bold mb-2">{selectedAnimal.name}</h2>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {getStatusBadge()}
        <Badge variant="outline" className="capitalize">
          {selectedAnimal.type}
        </Badge>
      </div>
      
      {/* Placeholder image */}
      <div className="bg-gray-100 w-full h-48 mb-4 rounded-md flex items-center justify-center text-gray-400">
        {selectedAnimal.type === 'cat' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.25 3.75 1.17 5-.47 1.34-1.26 2.5-2.33 3.32A8.03 8.03 0 0 1 20 16c0 3.5-2.8 2.96-4 1.5-.63 1.47-1.4 3-3.5 3s-2.88-1.53-3.5-3C7.8 18.96 5 19.5 5 16c0-1.77.57-3.34 1.5-4.64-1.1-.83-1.9-2-2.38-3.36-.08-1.25-.24-4.42 1.17-5 1.39-.58 4.65.26 6.43 2.26.65-.17 1.33-.26 2-.26Z" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 11h.01" />
            <path d="M14 11h.01" />
            <path d="M10 5.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0v-1Z" />
            <path d="M14 5.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0v-1Z" />
            <path d="M14.5 10a3.5 3.5 0 0 0-5 0" />
            <path d="m9 8-1.5-1.5" />
            <path d="M15 8 16.5 6.5" />
            <path d="M21.364 9.364a2 2 0 0 1 0 2.828" />
            <path d="M3.636 9.364a2 2 0 0 0 0 2.828" />
            <path d="M12 18c-1.1 0-2 .9-2 2v1h4v-1c0-1.1-.9-2-2-2z" />
            <path d="M12 19c-.5 0-1-.1-1.4-.4" />
            <path d="M6 10c0-4.4 3.6-8 8-8s8 3.6 8 8v10.5c0 .8-.7 1.5-1.5 1.5h-1c-.8 0-1.5-.7-1.5-1.5V10a4 4 0 0 0-8 0v8" />
            <path d="M6 19c-2.8 0-5-2.2-5-5v-4a2 2 0 0 1 2-2h3" />
          </svg>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700">{selectedAnimal.description}</p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Coordinates: {selectedAnimal.latitude.toFixed(4)}, {selectedAnimal.longitude.toFixed(4)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Reported {formatDistanceToNow(new Date(selectedAnimal.reportedAt))} ago</span>
        </div>
        
        {selectedAnimal.reportedBy && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>By: {selectedAnimal.reportedBy}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => handleStatusUpdate('being_helped')}
          className="bg-petmap-orange hover:bg-petmap-orange/90"
          disabled={selectedAnimal.status === 'being_helped'}
        >
          <Heart className="h-4 w-4 mr-2" />
          Help Now
        </Button>
        
        <Button variant="outline" onClick={() => {
          toast({
            title: "Opening Donation Form",
            description: "You'll be able to donate to help this animal."
          });
        }}>
          <DollarSign className="h-4 w-4 mr-2" />
          Donate
        </Button>
        
        <Button 
          onClick={() => handleStatusUpdate('adopted')}
          className="bg-petmap-green hover:bg-petmap-green/90"
          disabled={selectedAnimal.status === 'adopted'}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Adopted
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => handleStatusUpdate('needs_help')}
          disabled={selectedAnimal.status === 'needs_help'}
        >
          Mark Needs Help
        </Button>
      </div>
    </div>
  );
};
