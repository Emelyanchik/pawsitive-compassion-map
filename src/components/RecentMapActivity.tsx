
import React from 'react';
import { Clock, Users, MapPin, Bookmark, AlertCircle } from 'lucide-react';
import { formatDistance, calculateDistance } from '@/lib/geo-utils';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';

const RecentMapActivity: React.FC = () => {
  const { animals, userLocation } = useMap();
  const { toast } = useToast();
  
  // Get the 5 most recent animals reported
  const recentAnimals = [...animals]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);
  
  const handleActivityClick = (animal: any) => {
    toast({
      title: `Viewing ${animal.name}`,
      description: `Navigating to animal location`,
    });
    
    // This would typically integrate with a map navigation function
  };
  
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const reportedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - reportedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'needs_help': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'being_helped': return <Users className="w-4 h-4 text-blue-500" />;
      case 'adopted': return <Bookmark className="w-4 h-4 text-green-500" />;
      default: return <MapPin className="w-4 h-4 text-purple-500" />;
    }
  };
  
  const getDistanceText = (lat: number, lon: number) => {
    if (!userLocation) return '';
    
    const distance = formatDistance(
      calculateDistance(userLocation[1], userLocation[0], lat, lon)
    );
    
    return `${distance} away`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        {recentAnimals.length > 0 ? (
          recentAnimals.map((animal) => (
            <div 
              key={animal.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => handleActivityClick(animal)}
            >
              <div className="mt-1">{getStatusIcon(animal.status)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm truncate">{animal.name}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {getTimeAgo(animal.reportedAt)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 truncate">{animal.description}</p>
                
                {userLocation && (
                  <p className="text-xs text-gray-400 mt-1">
                    {getDistanceText(animal.latitude, animal.longitude)}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default RecentMapActivity;
