
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoIcon, ChevronDown, ChevronUp, Filter, X, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMap } from '@/contexts/MapContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { animals, statusFilter, setStatusFilter } = useMap();

  // Initialize expanded state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('mapLegendExpanded');
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }
  }, []);

  // Save expanded state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mapLegendExpanded', isExpanded.toString());
  }, [isExpanded]);

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

  const handleLegendItemClick = (itemId: string) => {
    setStatusFilter(prevFilter => prevFilter === itemId ? null : itemId);
  };

  const clearFilter = () => {
    setStatusFilter(null);
  };

  return (
    <Card className={cn(
      "absolute left-4 top-20 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300",
      statusFilter ? "border-primary" : ""
    )}>
      <div 
        className="p-3 flex items-center justify-between cursor-pointer border-b border-gray-200 dark:border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Map Legend</h3>
          {statusFilter && (
            <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs bg-primary/20 text-primary">
              Filtered
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <ScrollArea className="max-h-[300px]">
          <CardContent className="p-3">
            <div className="space-y-3">
              {statusFilter && (
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500">
                    Filtering by: {legendItems.find(item => item.id === statusFilter)?.label}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 p-0"
                    onClick={clearFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {legendItems.map(item => {
                // Determine if this status is currently hidden (future feature)
                const isVisible = true; // Will be connected to visibility toggle in future
                const isFiltered = statusFilter === item.id;
                
                return (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "flex items-start gap-3 p-1.5 rounded-md cursor-pointer transition-colors",
                            isFiltered 
                              ? "bg-gray-100 dark:bg-gray-700 border-l-2 border-primary" 
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                            !isVisible && "opacity-50"
                          )}
                          onClick={() => handleLegendItemClick(item.id)}
                        >
                          <div className="flex flex-col items-center mt-1">
                            <div 
                              className={cn(
                                "w-5 h-5 rounded-full flex-shrink-0",
                                isFiltered && "ring-2 ring-primary ring-offset-1"
                              )}
                              style={{ backgroundColor: item.color }} 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-1">
                              {item.label}
                              {isFiltered && (
                                <Filter className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                            <div className="text-xs font-medium mt-0.5">
                              {statusCounts[item.id] || 0} animals
                            </div>
                          </div>
                          
                          {/* Future feature: Toggle visibility */}
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // toggleVisibility(item.id);
                            }}
                          >
                            {isVisible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button> */}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">{isFiltered ? 'Click to clear filter' : 'Click to filter map'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              
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
