
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CloudRain, Sun, Cloud, Wind, Thermometer, umbrella, Home, Heart, Droplets } from 'lucide-react';

interface WeatherRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'shelter' | 'feeding' | 'exercise' | 'health' | 'safety';
  weatherCondition: string[];
}

const WeatherBasedRecommendations: React.FC = () => {
  // Mock weather conditions - in a real app, this would come from weather API
  const currentWeather = {
    temperature: 22,
    condition: 'partly_cloudy',
    precipitation: 20,
    windSpeed: 15,
    humidity: 70
  };

  const recommendations: WeatherRecommendation[] = [
    {
      id: '1',
      title: 'Prepare for Rain',
      description: 'Ensure outdoor animals have adequate shelter. Check that shelter roofs are waterproof.',
      priority: 'high',
      category: 'shelter',
      weatherCondition: ['rainy', 'partly_cloudy']
    },
    {
      id: '2',
      title: 'Provide Extra Water',
      description: 'High humidity may increase water needs. Ensure fresh water is always available.',
      priority: 'medium',
      category: 'health',
      weatherCondition: ['sunny', 'hot']
    },
    {
      id: '3',
      title: 'Indoor Exercise Recommended',
      description: 'Strong winds may stress animals. Consider indoor activities and secure outdoor areas.',
      priority: 'medium',
      category: 'exercise',
      weatherCondition: ['windy']
    },
    {
      id: '4',
      title: 'Monitor for Overheating',
      description: 'Watch for signs of heat stress in animals. Provide shade and cooling areas.',
      priority: 'high',
      category: 'health',
      weatherCondition: ['hot', 'sunny']
    }
  ];

  const getActiveRecommendations = () => {
    const active = [];
    
    // Add recommendations based on current weather
    if (currentWeather.precipitation > 0) {
      active.push(...recommendations.filter(r => r.weatherCondition.includes('rainy')));
    }
    
    if (currentWeather.condition === 'partly_cloudy' && currentWeather.precipitation > 15) {
      active.push(...recommendations.filter(r => r.weatherCondition.includes('partly_cloudy')));
    }
    
    if (currentWeather.windSpeed > 20) {
      active.push(...recommendations.filter(r => r.weatherCondition.includes('windy')));
    }
    
    if (currentWeather.temperature > 25) {
      active.push(...recommendations.filter(r => r.weatherCondition.includes('hot')));
    }
    
    if (currentWeather.humidity > 60) {
      active.push(...recommendations.filter(r => r.category === 'health'));
    }
    
    // Remove duplicates
    const uniqueRecommendations = active.filter((rec, index, self) => 
      index === self.findIndex(r => r.id === rec.id)
    );
    
    return uniqueRecommendations;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shelter': return <Home className="h-4 w-4" />;
      case 'feeding': return <Droplets className="h-4 w-4" />;
      case 'exercise': return <Wind className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'safety': return <umbrella className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shelter': return 'text-blue-500';
      case 'feeding': return 'text-green-500';
      case 'exercise': return 'text-purple-500';
      case 'health': return 'text-red-500';
      case 'safety': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const activeRecommendations = getActiveRecommendations();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            Weather-Based Care Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Weather Summary */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Current Conditions
              </span>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {currentWeather.temperature}°C
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-700 dark:text-blue-300">
              <span>Precipitation: {currentWeather.precipitation}%</span>
              <span>Wind: {currentWeather.windSpeed} km/h</span>
              <span>Humidity: {currentWeather.humidity}%</span>
            </div>
          </div>

          {/* Active Recommendations */}
          {activeRecommendations.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Active Recommendations</h3>
              {activeRecommendations.map((recommendation) => (
                <Alert key={recommendation.id}>
                  <div className="flex items-start gap-3">
                    <div className={getCategoryColor(recommendation.category)}>
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{recommendation.title}</h4>
                        <Badge variant={getPriorityColor(recommendation.priority)} className="text-xs">
                          {recommendation.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <AlertDescription className="text-xs">
                        {recommendation.description}
                      </AlertDescription>
                      <Badge variant="outline" className="text-xs">
                        {recommendation.category}
                      </Badge>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No specific weather recommendations at this time.</p>
              <p className="text-xs">Current conditions are suitable for normal animal care.</p>
            </div>
          )}

          {/* General Tips */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-3">General Weather Tips</h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Sun className="h-3 w-3" />
                <span>Always provide shade and fresh water during sunny weather</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-3 w-3" />
                <span>Ensure proper drainage around animal shelters</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-3 w-3" />
                <span>Secure loose items that could be blown around in windy conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-3 w-3" />
                <span>Monitor animals closely during extreme temperature changes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherBasedRecommendations;
