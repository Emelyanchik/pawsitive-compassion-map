
import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Cat, Dog, Clock, User, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity = () => {
  const { animals } = useMap();
  
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
          <div className="space-y-3">
            {recentAnimals.map((animal) => (
              <div key={animal.id} className="flex items-start gap-2 text-sm">
                {animal.type === 'cat' ? (
                  <Cat className="w-4 h-4 mt-0.5 text-petmap-green" />
                ) : animal.type === 'dog' ? (
                  <Dog className="w-4 h-4 mt-0.5 text-petmap-orange" />
                ) : (
                  <MapPin className="w-4 h-4 mt-0.5 text-petmap-blue" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{animal.name}</span>
                    <Badge 
                      variant={
                        animal.status === 'needs_help' ? 'destructive' :
                        animal.status === 'being_helped' ? 'warning' :
                        animal.status === 'adopted' ? 'success' : 'default'
                      }
                      className="text-xs"
                    >
                      {animal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {formatDistanceToNow(new Date(animal.reportedAt))} ago
                    {animal.reportedBy ? (
                      <span className="flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {animal.reportedBy}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
