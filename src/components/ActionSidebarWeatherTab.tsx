
import React from 'react';
import DetailedWeatherPanel from './DetailedWeatherPanel';
import { Button } from './ui/button';
import { CloudRain, MapPin, Target } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

interface ActionSidebarWeatherTabProps {
  onClose: () => void;
}

const ActionSidebarWeatherTab: React.FC<ActionSidebarWeatherTabProps> = ({ onClose }) => {
  const { userLocation, selectedAnimal } = useMap();
  const [selectedLocation, setSelectedLocation] = React.useState<[number, number] | undefined>(
    userLocation || undefined
  );
  
  const handleUseUserLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
    }
  };
  
  const handleUseSelectedAnimal = () => {
    if (selectedAnimal) {
      setSelectedLocation([selectedAnimal.longitude, selectedAnimal.latitude]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CloudRain className="h-5 w-5" />
          Weather Information
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant={selectedLocation === userLocation ? "default" : "outline"}
          onClick={handleUseUserLocation}
          disabled={!userLocation}
          className="flex items-center gap-1"
        >
          <MapPin className="h-4 w-4" />
          My Location
        </Button>
        
        <Button 
          size="sm" 
          variant={selectedLocation !== userLocation && selectedAnimal ? "default" : "outline"}
          onClick={handleUseSelectedAnimal}
          disabled={!selectedAnimal}
          className="flex items-center gap-1"
        >
          <Target className="h-4 w-4" />
          Selected Animal
        </Button>
      </div>
      
      <DetailedWeatherPanel location={selectedLocation} />
      
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">The weather information can be useful when planning:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Animal rescue operations</li>
          <li>Volunteer work in the field</li>
          <li>Preparation for extreme weather conditions</li>
          <li>Setting up shelter for outdoor animals</li>
        </ul>
      </div>
    </div>
  );
};

export default ActionSidebarWeatherTab;
