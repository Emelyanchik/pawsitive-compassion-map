import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Eye, Gauge, umbrella } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  condition: string;
  description: string;
  precipitation: number;
  cloudCover: number;
}

interface HourlyWeatherData {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

interface DailyWeatherData {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

interface DetailedWeatherPanelProps {
  location?: [number, number];
  mode?: 'current' | 'hourly' | 'daily';
  day?: string;
}

// Mock weather data - in a real app, this would come from an API
const mockCurrentWeather: WeatherData = {
  temperature: 22,
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NW',
  visibility: 10,
  pressure: 1013,
  uvIndex: 6,
  condition: 'partly_cloudy',
  description: 'Partly cloudy with light winds',
  precipitation: 0,
  cloudCover: 40
};

const mockHourlyWeather: HourlyWeatherData[] = [
  { time: '12:00', temperature: 22, condition: 'sunny', precipitation: 0 },
  { time: '13:00', temperature: 24, condition: 'partly_cloudy', precipitation: 0 },
  { time: '14:00', temperature: 25, condition: 'partly_cloudy', precipitation: 10 },
  { time: '15:00', temperature: 23, condition: 'cloudy', precipitation: 20 },
  { time: '16:00', temperature: 21, condition: 'rainy', precipitation: 80 },
  { time: '17:00', temperature: 19, condition: 'rainy', precipitation: 90 },
];

const mockDailyWeather: DailyWeatherData[] = [
  { date: 'Today', high: 25, low: 18, condition: 'partly_cloudy', precipitation: 20 },
  { date: 'Tomorrow', high: 23, low: 16, condition: 'rainy', precipitation: 80 },
  { date: 'Wednesday', high: 27, low: 20, condition: 'sunny', precipitation: 0 },
  { date: 'Thursday', high: 26, low: 19, condition: 'partly_cloudy', precipitation: 10 },
  { date: 'Friday', high: 24, low: 17, condition: 'cloudy', precipitation: 30 },
];

const DetailedWeatherPanel: React.FC<DetailedWeatherPanelProps> = ({ 
  location, 
  mode = 'current',
  day = 'today' 
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'partly_cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-600" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'bg-green-500';
    if (uvIndex <= 5) return 'bg-yellow-500';
    if (uvIndex <= 7) return 'bg-orange-500';
    if (uvIndex <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  if (!location) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Select a location to view weather information</p>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'current') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getWeatherIcon(mockCurrentWeather.condition)}
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{mockCurrentWeather.temperature}°C</span>
              <Badge variant="outline">{mockCurrentWeather.description}</Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Humidity: {mockCurrentWeather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Wind: {mockCurrentWeather.windSpeed} km/h {mockCurrentWeather.windDirection}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Visibility: {mockCurrentWeather.visibility} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-green-500" />
                <span className="text-sm">Pressure: {mockCurrentWeather.pressure} hPa</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">UV Index</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getUVIndexColor(mockCurrentWeather.uvIndex)}`}></div>
                <span className="text-sm font-medium">{mockCurrentWeather.uvIndex} - {getUVIndexLabel(mockCurrentWeather.uvIndex)}</span>
              </div>
            </div>
            
            {mockCurrentWeather.precipitation > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                <umbrella className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  {mockCurrentWeather.precipitation}% chance of rain
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'hourly') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Forecast - {day}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHourlyWeather.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="font-medium">{hour.time}</span>
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(hour.condition)}
                    <span>{hour.temperature}°C</span>
                    {hour.precipitation > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {hour.precipitation}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'daily') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDailyWeather.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="font-medium">{day.date}</span>
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(day.condition)}
                    <span className="text-sm">
                      {day.high}°/{day.low}°
                    </span>
                    {day.precipitation > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {day.precipitation}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default DetailedWeatherPanel;
