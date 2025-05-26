
import React from 'react';
import DetailedWeatherPanel from './DetailedWeatherPanel';
import WeatherBasedRecommendations from './WeatherBasedRecommendations';
import { Button } from './ui/button';
import { CloudRain, MapPin, Target, Clock, Info, Calendar } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActionSidebarWeatherTabProps {
  onClose: () => void;
}

const ActionSidebarWeatherTab: React.FC<ActionSidebarWeatherTabProps> = ({ onClose }) => {
  const { userLocation, selectedAnimal } = useMap();
  const [selectedLocation, setSelectedLocation] = React.useState<[number, number] | undefined>(
    userLocation || undefined
  );
  const [timeFrame, setTimeFrame] = React.useState<'current' | 'hourly' | 'daily'>('current');
  const [forecastDay, setForecastDay] = React.useState<string>('today');
  
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
      <div className="flex items-center justify-between mb-2">
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
      
      <Tabs defaultValue="current" className="w-full mt-2">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="current" onClick={() => setTimeFrame('current')}>
            <Clock className="h-4 w-4 mr-1" />
            Current
          </TabsTrigger>
          <TabsTrigger value="hourly" onClick={() => setTimeFrame('hourly')}>
            <Clock className="h-4 w-4 mr-1" />
            Hourly
          </TabsTrigger>
          <TabsTrigger value="daily" onClick={() => setTimeFrame('daily')}>
            <Calendar className="h-4 w-4 mr-1" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Info className="h-4 w-4 mr-1" />
            Tips
          </TabsTrigger>
        </TabsList>
        
        {timeFrame === 'hourly' && (
          <div className="my-2">
            <Select value={forecastDay} onValueChange={setForecastDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="day-after">Day after tomorrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <TabsContent value="current" className="space-y-4">
          <DetailedWeatherPanel location={selectedLocation} />
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <DetailedWeatherPanel 
            location={selectedLocation} 
            mode="hourly" 
            day={forecastDay}
          />
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <DetailedWeatherPanel 
            location={selectedLocation} 
            mode="daily"
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <WeatherBasedRecommendations />
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="mb-2 font-medium">The weather information can be useful when planning:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Animal rescue operations</li>
              <li>Volunteer work in the field</li>
              <li>Preparation for extreme weather conditions</li>
              <li>Setting up shelter for outdoor animals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionSidebarWeatherTab;
