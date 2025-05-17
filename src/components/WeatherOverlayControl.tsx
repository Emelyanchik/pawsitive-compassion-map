
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudRain, Thermometer, Cloud, XCircle, Radar, Satellite } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeatherOverlayControlProps {
  activeWeatherType: 'temperature' | 'precipitation' | 'clouds' | null;
  onWeatherTypeChange: (type: 'temperature' | 'precipitation' | 'clouds' | null) => void;
  onToggleRadar?: (type: 'radar' | 'satellite' | null) => void;
}

const WeatherOverlayControl: React.FC<WeatherOverlayControlProps> = ({
  activeWeatherType,
  onWeatherTypeChange,
  onToggleRadar
}) => {
  const [activeTab, setActiveTab] = useState<string>('data');
  const [radarType, setRadarType] = useState<'radar' | 'satellite' | null>(null);

  const handleToggle = (value: string) => {
    if (value === activeWeatherType || !value) {
      // If clicking the active button or value is empty, turn it off
      onWeatherTypeChange(null);
    } else {
      // Otherwise set to the new type
      onWeatherTypeChange(value as 'temperature' | 'precipitation' | 'clouds');
    }
  };

  const handleRadarToggle = (value: string) => {
    const newType = value ? value as 'radar' | 'satellite' : null;
    setRadarType(newType);
    onToggleRadar?.(newType);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
        Weather Overlay
      </div>
      
      <Tabs defaultValue="data" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-2">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data">
          <ToggleGroup type="single" value={activeWeatherType || ''} onValueChange={handleToggle}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="temperature" aria-label="Temperature" className="flex-1">
                  <Thermometer className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Temperature</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="precipitation" aria-label="Precipitation" className="flex-1">
                  <CloudRain className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Precipitation</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="clouds" aria-label="Cloud Cover" className="flex-1">
                  <Cloud className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Cloud Cover</TooltipContent>
            </Tooltip>
          </ToggleGroup>
          
          {activeWeatherType && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onWeatherTypeChange(null)}
              className="w-full mt-2 text-xs h-7"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Clear Overlay
            </Button>
          )}
        </TabsContent>
        
        <TabsContent value="radar">
          <ToggleGroup type="single" value={radarType || ''} onValueChange={handleRadarToggle}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="radar" aria-label="Weather Radar" className="flex-1">
                  <Radar className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Weather Radar</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="satellite" aria-label="Satellite" className="flex-1">
                  <Satellite className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Satellite</TooltipContent>
            </Tooltip>
          </ToggleGroup>
          
          {radarType && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRadarToggle('')}
              className="w-full mt-2 text-xs h-7"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Hide Radar
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherOverlayControl;
