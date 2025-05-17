
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, CloudRain, Cloud, Wind, Navigation, Sun, Droplet, Compass, 
  Umbrella, UmbrellaClosed, Clock, AlertTriangle
} from 'lucide-react';
import { useMap } from '@/contexts/MapContext';
import { Badge } from '@/components/ui/badge';

interface DetailedWeatherPanelProps {
  location?: [number, number]; // Optional location, defaults to user location
  mode?: 'current' | 'hourly' | 'daily';
  day?: string;
}

const DetailedWeatherPanel: React.FC<DetailedWeatherPanelProps> = ({ 
  location,
  mode = 'current', 
  day = 'today'
}) => {
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
    uvIndex: 5,
    sunrise: '6:23 AM',
    sunset: '8:17 PM',
    hourlyForecast: [
      { time: '9:00 AM', temp: 19, condition: 'Cloudy', precipitation: 10 },
      { time: '10:00 AM', temp: 21, condition: 'Partly Cloudy', precipitation: 5 },
      { time: '11:00 AM', temp: 22, condition: 'Sunny', precipitation: 0 },
      { time: '12:00 PM', temp: 24, condition: 'Sunny', precipitation: 0 },
      { time: '1:00 PM', temp: 25, condition: 'Sunny', precipitation: 0 },
      { time: '2:00 PM', temp: 26, condition: 'Partly Cloudy', precipitation: 0 },
      { time: '3:00 PM', temp: 25, condition: 'Partly Cloudy', precipitation: 5 },
      { time: '4:00 PM', temp: 24, condition: 'Cloudy', precipitation: 15 },
      { time: '5:00 PM', temp: 23, condition: 'Rain', precipitation: 50 },
      { time: '6:00 PM', temp: 21, condition: 'Rain', precipitation: 60 },
      { time: '7:00 PM', temp: 20, condition: 'Cloudy', precipitation: 30 },
      { time: '8:00 PM', temp: 19, condition: 'Cloudy', precipitation: 20 }
    ],
    alerts: [
      { type: 'Rain', description: 'Heavy rain possible in the afternoon', severity: 'moderate' }
    ],
    forecast: [
      { day: 'Today', high: 24, low: 19, condition: 'Partly Cloudy', precipitation: 40 },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny', precipitation: 0 },
      { day: 'Wednesday', high: 23, low: 18, condition: 'Rain', precipitation: 80 },
      { day: 'Thursday', high: 21, low: 17, condition: 'Cloudy', precipitation: 20 },
      { day: 'Friday', high: 22, low: 18, condition: 'Partly Cloudy', precipitation: 10 },
    ]
  };
  
  const getConditionIcon = (condition: string, size = 5) => {
    switch(condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`h-${size} w-${size} text-yellow-500`} />;
      case 'rain':
        return <CloudRain className={`h-${size} w-${size} text-blue-500`} />;
      case 'cloudy':
        return <Cloud className={`h-${size} w-${size} text-gray-500`} />;
      case 'partly cloudy':
      default:
        return <Cloud className={`h-${size} w-${size} text-gray-400`} />;
    }
  };
  
  const formatDay = (day: string) => {
    // Only show first 3 letters except for "Today" and "Tomorrow"
    if (day === 'Today' || day === 'Tomorrow') return day;
    return day.substring(0, 3);
  };

  const getPrecipitationIcon = (chance: number) => {
    if (chance > 0) {
      return <Umbrella className={`h-4 w-4 ${chance > 50 ? 'text-blue-600' : 'text-blue-400'}`} />;
    }
    return <UmbrellaClosed className="h-4 w-4 text-gray-400" />;
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
  
  const renderCurrentWeather = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>Coordinates: {weatherData.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherData.alerts && weatherData.alerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">{weatherData.alerts[0].type} Alert</p>
              <p className="text-xs text-amber-700">{weatherData.alerts[0].description}</p>
            </div>
          </div>
        )}
        
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
        
        <div className="flex justify-between text-xs text-muted-foreground mt-4 pt-2 border-t">
          <div>Sunrise: {weatherData.sunrise}</div>
          <div>Sunset: {weatherData.sunset}</div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Today's Forecast</h3>
          <div className="grid grid-cols-4 gap-2">
            {weatherData.hourlyForecast.slice(0,4).map((hour, index) => (
              <div key={index} className="flex flex-col items-center bg-muted/50 rounded-md p-2">
                <span className="text-xs font-medium">{hour.time}</span>
                <div className="my-1">{getConditionIcon(hour.condition, 4)}</div>
                <span className="font-medium text-sm">{hour.temp}°</span>
                <div className="mt-1">
                  {getPrecipitationIcon(hour.precipitation)}
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
  
  const renderHourlyForecast = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
        <CardDescription>For {day}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-max gap-3 pb-2">
            {weatherData.hourlyForecast.map((hour, index) => (
              <div key={index} className="flex flex-col items-center bg-muted/30 rounded-md p-2 min-w-[70px]">
                <span className="text-xs font-medium">{hour.time}</span>
                <div className="my-1">{getConditionIcon(hour.condition, 5)}</div>
                <span className="font-medium text-lg">{hour.temp}°</span>
                <div className="mt-1 flex items-center gap-1">
                  {getPrecipitationIcon(hour.precipitation)}
                  <span className="text-xs">{hour.precipitation}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Scroll horizontally to see more hours.
      </CardFooter>
    </Card>
  );
  
  const renderDailyForecast = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
        <CardDescription>Extended outlook</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-8">{getConditionIcon(day.condition, 5)}</div>
                <span className="font-medium w-24">{formatDay(day.day)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getPrecipitationIcon(day.precipitation)}
                <span className="text-xs w-6">{day.precipitation}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{day.high}°</span>
                <span className="text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Weather data is simulated for demonstration purposes.
      </CardFooter>
    </Card>
  );
  
  switch (mode) {
    case 'hourly':
      return renderHourlyForecast();
    case 'daily':
      return renderDailyForecast();
    default:
      return renderCurrentWeather();
  }
};

export default DetailedWeatherPanel;
