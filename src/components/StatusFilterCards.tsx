
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMap } from '@/contexts/MapContext';
import { AlertTriangle, Check, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusFilterCards = () => {
  const { animals, statusFilter, setStatusFilter } = useMap();

  // Count animals by status
  const statusCounts = animals.reduce((acc, animal) => {
    acc[animal.status] = (acc[animal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statuses = [
    { id: 'needs_help', label: 'Needs Help', color: 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900/30', icon: HelpCircle },
    { id: 'being_helped', label: 'Being Helped', color: 'bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-900/30', icon: Clock },
    { id: 'adopted', label: 'Adopted', color: 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30', icon: Check },
    { id: 'reported', label: 'Reported', color: 'bg-purple-100 border-purple-400 text-purple-700 dark:bg-purple-900/30', icon: AlertTriangle }
  ];

  const handleFilterClick = (status: string | null) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  return (
    <div className="flex flex-wrap gap-3 p-4">
      {statuses.map(status => (
        <Card 
          key={status.id}
          className={cn(
            "cursor-pointer border transition-all hover:shadow",
            status.color,
            statusFilter === status.id ? "ring-2 ring-offset-2" : ""
          )}
          onClick={() => handleFilterClick(status.id)}
        >
          <CardContent className="p-4 flex items-center space-x-3">
            <status.icon className="h-5 w-5" />
            <div>
              <div className="font-medium">{status.label}</div>
              <div className="text-sm">{statusCounts[status.id] || 0} animals</div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {statusFilter && (
        <Card 
          className="cursor-pointer border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          onClick={() => handleFilterClick(null)}
        >
          <CardContent className="p-4 flex items-center justify-center">
            <span>Clear filter</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatusFilterCards;
