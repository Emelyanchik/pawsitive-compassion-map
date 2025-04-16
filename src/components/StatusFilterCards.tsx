
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMap } from '@/contexts/MapContext';
import { AlertTriangle, Check, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const StatusFilterCards = () => {
  const { animals, statusFilter, setStatusFilter } = useMap();

  // Count animals by status
  const statusCounts = animals.reduce((acc, animal) => {
    acc[animal.status] = (acc[animal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statuses = [
    { id: 'needs_help', label: 'Needs Help', color: 'text-red-700 dark:text-red-500', icon: HelpCircle },
    { id: 'being_helped', label: 'Being Helped', color: 'text-orange-700 dark:text-orange-500', icon: Clock },
    { id: 'adopted', label: 'Adopted', color: 'text-green-700 dark:text-green-500', icon: Check },
    { id: 'reported', label: 'Reported', color: 'text-purple-700 dark:text-purple-500', icon: AlertTriangle }
  ];

  const handleFilterClick = (value: string) => {
    setStatusFilter(value === statusFilter ? null : value);
  };

  return (
    <div className="p-4">
      <ToggleGroup
        type="single"
        value={statusFilter || ""}
        onValueChange={handleFilterClick}
        className="flex flex-wrap gap-3 justify-center sm:justify-start w-full"
      >
        {statuses.map(status => (
          <ToggleGroupItem 
            key={status.id} 
            value={status.id}
            className={cn(
              "flex items-center space-x-2 p-3 border transition-all hover:shadow",
              status.color
            )}
          >
            <status.icon className="h-5 w-5" />
            <div>
              <div className="font-medium">{status.label}</div>
              <div className="text-sm">{statusCounts[status.id] || 0} animals</div>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      {statusFilter && (
        <div className="flex justify-center mt-3">
          <Card 
            className="cursor-pointer border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
            onClick={() => setStatusFilter(null)}
          >
            <CardContent className="p-3 flex items-center justify-center">
              <span>Clear filter</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StatusFilterCards;
