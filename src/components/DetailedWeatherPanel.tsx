
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, CloudRain, Cloud, Wind, Navigation, Sun, Droplet, Compass } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

interface DetailedWeatherPanelProps {
  location?: [number, number]; // Optional location, defaults to user location
}

const DetailedWeatherPanel: React.FC<DetailedWeatherPanelProps> = ({ location }) => {
  const { userLocation } = useMap();
  const weatherLocation = location || userLocation;
  
  // Mock weather data - in a real app this would come from a weather API
  const weatherData = {
    location: weatherLocation ? `${weatherLocation[1].toFixed(4)}, ${weatherLocation[0].toFixed(4)}` : 'Unknown',
    temperature: 22,
    feelsLike: 24,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    precipitation: 10,
    cloudCover: 40,
    visibility: 8,
    pressure: 1015,
    forecast: [
      { day: 'Today', high: 24, low: 19, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny' },
      { day: 'Wednesday', high: 23, low: 18, condition: 'Rain' },
      { day: 'Thursday', high: 21, low: 17, condition: 'Cloudy' },
      { day: 'Friday', high: 22, low: 18, condition: 'Partly Cloudy' },
    ]
  };
  
  const getConditionIcon = (condition: string) => {
    switch(condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'partly cloudy':
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const formatDay = (day: string) => {
    // Only show first 3 letters except for "Today" and "Tomorrow"
    if (day === 'Today' || day === 'Tomorrow') return day;
    return day.substring(0, 3);
  };
  
  if (!weatherLocation) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
          <CardDescription>Location unavailable</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please enable location services or select a location on the map to see weather information.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>Coordinates: {weatherData.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <div className="font-bold text-2xl">{weatherData.temperature}°C</div>
              <div className="text-xs text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{weatherData.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Compass className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{weatherData.windDirection}</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Cloud className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{weatherData.cloudCover}%</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center bg-muted/50 rounded-md p-2">
                <span className="text-xs font-medium">{formatDay(day.day)}</span>
                <div className="my-1">{getConditionIcon(day.condition)}</div>
                <div className="text-xs">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground ml-1">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Weather data is simulated for demonstration purposes.
      </CardFooter>
    </Card>
  );
};

export default DetailedWeatherPanel;
