
import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, AlertTriangle, Siren, MapPin, Clock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface EmergencyAlert {
  id: string;
  type: 'severe_weather' | 'missing_pet' | 'dangerous_animal' | 'evacuation';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates?: [number, number];
}

const EmergencyAlertsBanner: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: '1',
      type: 'severe_weather',
      title: 'Severe Weather Warning',
      description: 'Heavy rainfall and strong winds expected in the next 2 hours. Secure outdoor animals.',
      location: 'City Center Area',
      timestamp: '2 minutes ago',
      severity: 'high',
      coordinates: [-0.127, 51.507]
    },
    {
      id: '2',
      type: 'missing_pet',
      title: 'Missing Pet Alert',
      description: 'Golden Retriever "Max" missing since yesterday evening. Last seen near Central Park.',
      location: 'Central Park vicinity',
      timestamp: '1 hour ago',
      severity: 'medium'
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'severe_weather': return <AlertTriangle className="h-4 w-4" />;
      case 'missing_pet': return <MapPin className="h-4 w-4" />;
      case 'dangerous_animal': return <Siren className="h-4 w-4" />;
      case 'evacuation': return <Siren className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900">
            <div className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                {alerts.length} Emergency Alert{alerts.length > 1 ? 's' : ''}
              </span>
              <Badge variant="destructive" className="text-xs">
                {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} High Priority
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
              {isExpanded ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-2 pb-2 space-y-2">
            {alerts.map((alert) => (
              <Alert key={alert.id} className="relative">
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <AlertDescription className="text-xs">
                      {alert.description}
                    </AlertDescription>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EmergencyAlertsBanner;
