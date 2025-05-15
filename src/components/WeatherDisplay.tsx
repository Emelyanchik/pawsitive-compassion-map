
import React, { useEffect, useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, 
  Sun, Wind, Thermometer, Droplets, Sunrise, Sunset
} from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';

interface WeatherData {
  temperature: number;
  weatherType: string;
  humidity: number;
  windSpeed: number;
  description: string;
  feelsLike?: number;
  sunrise?: string;
  sunset?: string;
  forecast?: Array<{
    day: string;
    high: number;
    low: number;
    type: string;
    precipitation: number;
  }>
}

const mockWeatherData = [
  {
    temperature: 22,
    weatherType: 'sunny',
    humidity: 45,
    windSpeed: 8,
    description: 'Clear sky',
    feelsLike: 24,
    sunrise: '6:05 AM',
    sunset: '8:32 PM',
    forecast: [
      { day: 'Today', high: 22, low: 15, type: 'sunny', precipitation: 0 },
      { day: 'Tomorrow', high: 24, low: 16, type: 'partly-cloudy', precipitation: 10 },
      { day: 'Wed', high: 21, low: 14, type: 'cloudy', precipitation: 20 },
      { day: 'Thu', high: 19, low: 13, type: 'rainy', precipitation: 80 },
      { day: 'Fri', high: 18, low: 12, type: 'rainy', precipitation: 75 }
    ]
  },
  {
    temperature: 16,
    weatherType: 'cloudy',
    humidity: 75,
    windSpeed: 12,
    description: 'Overcast clouds',
    feelsLike: 14,
    sunrise: '6:03 AM',
    sunset: '8:34 PM',
    forecast: [
      { day: 'Today', high: 16, low: 12, type: 'cloudy', precipitation: 20 },
      { day: 'Tomorrow', high: 18, low: 13, type: 'partly-cloudy', precipitation: 15 },
      { day: 'Wed', high: 20, low: 14, type: 'sunny', precipitation: 5 },
      { day: 'Thu', high: 21, low: 15, type: 'sunny', precipitation: 0 },
      { day: 'Fri', high: 22, low: 16, type: 'partly-cloudy', precipitation: 10 }
    ]
  },
  {
    temperature: 18,
    weatherType: 'rainy',
    humidity: 80,
    windSpeed: 15,
    description: 'Light rain',
    feelsLike: 16,
    sunrise: '6:07 AM',
    sunset: '8:30 PM',
    forecast: [
      { day: 'Today', high: 18, low: 14, type: 'rainy', precipitation: 70 },
      { day: 'Tomorrow', high: 17, low: 13, type: 'rainy', precipitation: 80 },
      { day: 'Wed', high: 19, low: 14, type: 'cloudy', precipitation: 40 },
      { day: 'Thu', high: 20, low: 15, type: 'partly-cloudy', precipitation: 20 },
      { day: 'Fri', high: 22, low: 16, type: 'sunny', precipitation: 5 }
    ]
  },
  {
    temperature: 12,
    weatherType: 'snowy',
    humidity: 90,
    windSpeed: 10,
    description: 'Light snow',
    feelsLike: 8,
    sunrise: '6:10 AM',
    sunset: '8:28 PM',
    forecast: [
      { day: 'Today', high: 12, low: 5, type: 'snowy', precipitation: 85 },
      { day: 'Tomorrow', high: 14, low: 6, type: 'partly-cloudy', precipitation: 30 },
      { day: 'Wed', high: 15, low: 7, type: 'cloudy', precipitation: 40 },
      { day: 'Thu', high: 13, low: 6, type: 'snowy', precipitation: 60 },
      { day: 'Fri', high: 12, low: 5, type: 'rainy', precipitation: 75 }
    ]
  },
  {
    temperature: 24,
    weatherType: 'partly-cloudy',
    humidity: 55,
    windSpeed: 7,
    description: 'Partly cloudy',
    feelsLike: 25,
    sunrise: '6:01 AM',
    sunset: '8:35 PM',
    forecast: [
      { day: 'Today', high: 24, low: 17, type: 'partly-cloudy', precipitation: 15 },
      { day: 'Tomorrow', high: 26, low: 18, type: 'sunny', precipitation: 5 },
      { day: 'Wed', high: 28, low: 19, type: 'sunny', precipitation: 0 },
      { day: 'Thu', high: 29, low: 20, type: 'sunny', precipitation: 0 },
      { day: 'Fri', high: 27, low: 19, type: 'partly-cloudy', precipitation: 10 }
    ]
  },
  {
    temperature: 14,
    weatherType: 'foggy',
    humidity: 95,
    windSpeed: 5,
    description: 'Fog',
    feelsLike: 13,
    sunrise: '6:09 AM',
    sunset: '8:29 PM',
    forecast: [
      { day: 'Today', high: 14, low: 10, type: 'foggy', precipitation: 30 },
      { day: 'Tomorrow', high: 16, low: 11, type: 'cloudy', precipitation: 25 },
      { day: 'Wed', high: 18, low: 12, type: 'partly-cloudy', precipitation: 15 },
      { day: 'Thu', high: 20, low: 14, type: 'sunny', precipitation: 5 },
      { day: 'Fri', high: 22, low: 15, type: 'sunny', precipitation: 0 }
    ]
  },
  {
    temperature: 20,
    weatherType: 'thunderstorm',
    humidity: 85,
    windSpeed: 25,
    description: 'Thunderstorm',
    feelsLike: 19,
    sunrise: '6:04 AM',
    sunset: '8:33 PM',
    forecast: [
      { day: 'Today', high: 20, low: 15, type: 'thunderstorm', precipitation: 90 },
      { day: 'Tomorrow', high: 18, low: 14, type: 'rainy', precipitation: 80 },
      { day: 'Wed', high: 19, low: 14, type: 'cloudy', precipitation: 40 },
      { day: 'Thu', high: 21, low: 16, type: 'partly-cloudy', precipitation: 20 },
      { day: 'Fri', high: 23, low: 17, type: 'sunny', precipitation: 5 }
    ]
  }
];

const WeatherDisplay = () => {
  const { userLocation } = useMap();
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'forecast'>('current');

  useEffect(() => {
    // Simulate fetching weather data for the user's location
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an actual API call to a weather service
        // For demo purposes, we'll just use mock data
        const randomIndex = Math.floor(Math.random() * mockWeatherData.length);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeather(mockWeatherData[randomIndex]);
      } catch (error) {
        console.error('Error fetching weather:', error);
        toast({
          title: "Weather Error",
          description: "Could not fetch weather information.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchWeather();
    }
  }, [userLocation]);

  const getWeatherIcon = (type: string, size: number = 6) => {
    const iconClass = `w-${size} h-${size}`;

    switch (type) {
      case 'sunny':
        return <Sun className={`${iconClass} text-amber-400`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case 'partly-cloudy':
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'snowy':
        return <CloudSnow className={`${iconClass} text-sky-200`} />;
      case 'foggy':
        return <CloudFog className={`${iconClass} text-gray-300`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${iconClass} text-amber-500`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${iconClass} text-blue-300`} />;
      default:
        return <Cloud className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400">Weather data unavailable</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => toast({
            title: "Weather Feature",
            description: "This feature will use your location to provide real-time weather updates.",
          })}
        >
          Enable Weather
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-500 mb-3 dark:text-gray-400">Weather Information</h3>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'current' | 'forecast')} 
        className="mb-1"
      >
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full">
                {getWeatherIcon(weather.weatherType)}
              </div>
              <div>
                <p className="text-2xl font-semibold">{weather.temperature}°C</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{weather.description}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-end gap-1">
                <Thermometer className="w-3 h-3" /> 
                Feels like {weather.feelsLike}°C
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 bg-gray-50 dark:bg-gray-700/40">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
                  <p className="text-sm font-medium">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-gray-50 dark:bg-gray-700/40">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                  <p className="text-sm font-medium">{weather.humidity}%</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="flex justify-between pt-1 text-xs text-gray-500 dark:text-gray-400 border-t">
            <div className="flex items-center">
              <Sunrise className="w-3 h-3 mr-1" /> {weather.sunrise}
            </div>
            <div className="flex items-center">
              <Sunset className="w-3 h-3 mr-1" /> {weather.sunset}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast" className="pt-3">
          {weather.forecast && (
            <div className="space-y-2">
              {weather.forecast.map((day) => (
                <div 
                  key={day.day} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8">
                      {getWeatherIcon(day.type, 4)}
                    </div>
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {day.precipitation > 0 ? `${day.precipitation}% precip.` : 'No precipitation'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{day.high}°C</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {day.low}°C
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherDisplay;
