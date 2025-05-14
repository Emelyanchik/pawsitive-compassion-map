
import React, { useEffect, useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface WeatherData {
  temperature: number;
  weatherType: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

const mockWeatherData = [
  {
    temperature: 22,
    weatherType: 'sunny',
    humidity: 45,
    windSpeed: 8,
    description: 'Clear sky'
  },
  {
    temperature: 16,
    weatherType: 'cloudy',
    humidity: 75,
    windSpeed: 12,
    description: 'Overcast clouds'
  },
  {
    temperature: 18,
    weatherType: 'rainy',
    humidity: 80,
    windSpeed: 15,
    description: 'Light rain'
  },
  {
    temperature: 12,
    weatherType: 'snowy',
    humidity: 90,
    windSpeed: 10,
    description: 'Light snow'
  },
  {
    temperature: 24,
    weatherType: 'partly-cloudy',
    humidity: 55,
    windSpeed: 7,
    description: 'Partly cloudy'
  },
  {
    temperature: 14,
    weatherType: 'foggy',
    humidity: 95,
    windSpeed: 5,
    description: 'Fog'
  },
  {
    temperature: 20,
    weatherType: 'thunderstorm',
    humidity: 85,
    windSpeed: 25,
    description: 'Thunderstorm'
  }
];

const WeatherDisplay = () => {
  const { userLocation } = useMap();
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-6 h-6" />;

    switch (weather.weatherType) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-amber-400" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="w-6 h-6 text-sky-200" />;
      case 'foggy':
        return <CloudFog className="w-6 h-6 text-gray-300" />;
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 text-amber-500" />;
      case 'drizzle':
        return <CloudDrizzle className="w-6 h-6 text-blue-300" />;
      default:
        return <Cloud className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-4 border rounded-lg bg-white text-center">
        <p className="text-gray-500">Weather data unavailable</p>
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
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Local Weather</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-full">
            {getWeatherIcon()}
          </div>
          <div>
            <p className="text-lg font-semibold">{weather.temperature}°C</p>
            <p className="text-sm text-gray-500">{weather.description}</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
