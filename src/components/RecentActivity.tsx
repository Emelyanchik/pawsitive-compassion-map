
import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Cat, Dog, Clock, User, MapPin, Calendar, Heart, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useMediaQuery } from '@/hooks/use-media-query';

export const RecentActivity = () => {
  const { animals } = useMap();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Sort animals by reportedAt date (newest first)
  const recentAnimals = [...animals]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5); // Get only the 5 most recent
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {recentAnimals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentAnimals.map((animal) => (
              <div key={animal.id} className="group">
                <div className="flex items-start gap-3 text-sm">
                  {animal.type === 'cat' ? (
                    <Cat className="w-5 h-5 mt-0.5 text-petmap-green" />
                  ) : animal.type === 'dog' ? (
                    <Dog className="w-5 h-5 mt-0.5 text-petmap-orange" />
                  ) : (
                    <MapPin className="w-5 h-5 mt-0.5 text-petmap-blue" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{animal.name}</span>
                      <Badge 
                        variant={
                          animal.status === 'needs_help' ? 'destructive' :
                          animal.status === 'being_helped' ? 'warning' :
                          animal.status === 'adopted' ? 'success' : 'info'
                        }
                        className="text-xs"
                      >
                        {animal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">
                      {formatDistanceToNow(new Date(animal.reportedAt))} ago
                    </p>
                    <div className="mt-1 text-xs flex items-center gap-2">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{animal.latitude.toFixed(2)}, {animal.longitude.toFixed(2)}</span>
                      </div>
                      
                      {animal.reportedBy && (
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-3 h-3 mr-1" />
                          <span>{animal.reportedBy}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300">
                      <Separator className="my-2" />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Reported on {format(new Date(animal.reportedAt), 'MMM d, yyyy')}</span>
                        </div>
                        {animal.description && (
                          <p className="text-muted-foreground italic mt-1">{animal.description}</p>
                        )}
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {recentAnimals.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-muted-foreground mt-2"
              >
                View all activity
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
