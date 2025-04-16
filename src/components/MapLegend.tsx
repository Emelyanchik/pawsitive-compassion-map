
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMap } from '@/contexts/MapContext';

const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { animals } = useMap();

  // Count animals by status for the legend
  const statusCounts = animals.reduce((acc, animal) => {
    acc[animal.status] = (acc[animal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const legendItems = [
    { id: 'needs_help', label: 'Needs Help', color: '#FF4500', description: 'Animals that need immediate assistance' },
    { id: 'being_helped', label: 'Being Helped', color: '#FFA500', description: 'Animals currently receiving assistance' },
    { id: 'adopted', label: 'Adopted', color: '#32CD32', description: 'Animals that have found a home' },
    { id: 'reported', label: 'Reported', color: '#9B30FF', description: 'Animals that have been reported but not verified' }
  ];

  return (
    <Card className="absolute left-4 top-20 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer border-b border-gray-200 dark:border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Map Legend</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <ScrollArea className="max-h-[300px]">
          <CardContent className="p-3">
            <div className="space-y-3">
              {legendItems.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <div 
                      className="w-5 h-5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                  </div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                    <div className="text-xs font-medium mt-0.5">
                      {statusCounts[item.id] || 0} animals
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Click on any animal marker on the map to see its details and take action.
                </div>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      )}
    </Card>
  );
};

export default MapLegend;
