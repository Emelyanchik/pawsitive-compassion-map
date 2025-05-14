
import React, { useState, useEffect } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

interface WeatherSummaryProps {
  onClick?: () => void;
}

const WeatherSummaryWidget: React.FC<WeatherSummaryProps> = ({ onClick }) => {
  const [weather, setWeather] = useState<{type: string, temp: number} | null>(null);
  const { userLocation } = useMap();
  
  useEffect(() => {
    // Mock weather data - in a real app, fetch from API
    if (userLocation) {
      const weatherTypes = ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy', 'thunderstorm'];
      const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 5; // random temp between 5-35°C
      
      setWeather({
        type: randomType,
        temp: randomTemp
      });
    }
  }, [userLocation]);
  
  if (!weather || !userLocation) return null;
  
  const getWeatherIcon = () => {
    switch (weather.type) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="w-4 h-4 text-blue-200" />;
      case 'foggy':
        return <CloudFog className="w-4 h-4 text-gray-300" />;
      case 'thunderstorm':
        return <CloudLightning className="w-4 h-4 text-amber-500" />;
      case 'drizzle':
        return <CloudDrizzle className="w-4 h-4 text-blue-300" />;
      default:
        return <Cloud className="w-4 h-4" />;
    }
  };
  
  return (
    <button 
      className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      {getWeatherIcon()}
      <span className="font-medium">{weather.temp}°C</span>
    </button>
  );
};

export default WeatherSummaryWidget;
