
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMap } from '@/contexts/MapContext';
import { Input } from '@/components/ui/input';
import { ArrowRight, Navigation, MapPin, LocateFixed } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface DirectionsPanelProps {
  onClose: () => void;
  animalLocation?: [number, number];
}

const DirectionsPanel: React.FC<DirectionsPanelProps> = ({ onClose, animalLocation }) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [hasDirections, setHasDirections] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<string | null>(null);
  const { toast } = useToast();
  const { userLocation } = useMap();

  const useCurrentLocation = () => {
    if (!userLocation) {
      toast({
        title: "Location Not Available",
        description: "Please enable location services or enter a starting point manually.",
        variant: "destructive",
      });
      return;
    }
    
    // Format as "latitude, longitude"
    setOrigin(`${userLocation[1].toFixed(6)}, ${userLocation[0].toFixed(6)}`);
  };

  const useAnimalLocation = () => {
    if (!animalLocation) {
      toast({
        title: "Animal Location Not Available",
        description: "Please select an animal on the map first.",
        variant: "destructive",
      });
      return;
    }
    
    setDestination(`${animalLocation[0].toFixed(6)}, ${animalLocation[1].toFixed(6)}`);
  };

  const getDirections = () => {
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please provide both origin and destination locations.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingDirections(true);
    
    // Simulate API call to get directions
    setTimeout(() => {
      // In a real app, you would call a directions API like Mapbox Directions API
      setEstimatedTime("25 minutes");
      setEstimatedDistance("5.3 km");
      setHasDirections(true);
      setIsLoadingDirections(false);
      
      toast({
        title: "Directions Found",
        description: "Route calculated successfully.",
      });
    }, 1500);
  };

  const openInMaps = () => {
    // Create a Google Maps URL with the directions
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Get Directions</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              <Navigation className="h-3 w-3 mr-1" />
              From
            </Badge>
            <label htmlFor="origin" className="sr-only">Starting point</label>
          </div>
          <div className="flex gap-2">
            <Input
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting point"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={useCurrentLocation}
              title="Use current location"
            >
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              <MapPin className="h-3 w-3 mr-1" />
              To
            </Badge>
            <label htmlFor="destination" className="sr-only">Destination</label>
          </div>
          <div className="flex gap-2">
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="flex-1"
            />
            {animalLocation && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={useAnimalLocation}
                title="Use animal location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={getDirections}
          disabled={isLoadingDirections}
        >
          {isLoadingDirections ? "Finding Route..." : "Get Directions"}
        </Button>
      </div>
      
      {hasDirections && (
        <div className="mt-4 border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Estimated travel time:</span>
            <span>{estimatedTime}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="font-medium">Distance:</span>
            <span>{estimatedDistance}</span>
          </div>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={openInMaps}
          >
            Open in Google Maps
          </Button>
        </div>
      )}
    </div>
  );
};

export default DirectionsPanel;
