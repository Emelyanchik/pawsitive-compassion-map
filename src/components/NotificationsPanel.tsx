
import React, { useState } from 'react';
import { Bell, XCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'update';
  timestamp: string;
  read: boolean;
  animalId?: string;
  coordinates?: [number, number];
}

export const NotificationsPanel = () => {
  const { toast } = useToast();
  const { userLocation, setSelectedAnimal, animals } = useMap();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New animal reported nearby',
      message: 'A cat has been reported 500m from your location.',
      type: 'alert',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read: false,
      animalId: '1',
      coordinates: [-0.127, 51.507]
    },
    {
      id: '2',
      title: 'Animal status updated',
      message: 'Buddy is now being helped by a volunteer.',
      type: 'update',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
      animalId: '2'
    },
    {
      id: '3',
      title: 'Volunteer needed',
      message: 'Shadow needs help. Can you volunteer?',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: false,
      animalId: '3',
      coordinates: [-0.135, 51.513]
    }
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const handleShowOnMap = (animalId?: string, coordinates?: [number, number]) => {
    if (animalId) {
      const animal = animals.find(a => a.id === animalId);
      if (animal) {
        setSelectedAnimal(animal);
        toast({
          title: "Location Found",
          description: `Showing ${animal.name || 'animal'} on the map.`,
        });
      }
    } else if (coordinates) {
      // This would typically fly to the coordinates on the map
      toast({
        title: "Location Found",
        description: "Showing location on the map.",
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications Updated",
      description: "All notifications marked as read.",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  return (
    <div className="w-full max-w-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </h2>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 border rounded-lg relative ${
                  !notification.read 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30' 
                    : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${!notification.read ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm mt-1 mb-2 text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>
                <div className="flex justify-end">
                  {(notification.animalId || notification.coordinates) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleShowOnMap(notification.animalId, notification.coordinates)}
                    >
                      <MapPin className="h-3 w-3" />
                      Show on map
                    </Button>
                  )}
                </div>
                {!notification.read && (
                  <div className="absolute top-1 right-1 h-3 w-3 bg-blue-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500">
          <Bell className="h-12 w-12 mb-2 text-gray-300" />
          <p className="text-center">No notifications yet.</p>
          <p className="text-sm text-center mt-1">
            You'll be notified about animal reports and status updates nearby.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
