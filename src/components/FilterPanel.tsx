
import React from 'react';
import { X, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { filter, setFilter, animals } = useMap();
  
  // Count animals by type and status
  const counts = {
    all: animals.length,
    cats: animals.filter(a => a.type === 'cat').length,
    dogs: animals.filter(a => a.type === 'dog').length,
    needsHelp: animals.filter(a => a.status === 'needs_help').length,
    beingHelped: animals.filter(a => a.status === 'being_helped').length,
    adopted: animals.filter(a => a.status === 'adopted').length,
    reported: animals.filter(a => a.status === 'reported').length,
  };
  
  return (
    <div className="relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 mb-6 pr-8">
        <Filter className="h-5 w-5" />
        <h2 className="text-xl font-bold">Filter Animals</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">By Animal Type</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                filter === 'all' && "border-primary border-2"
              )}
              onClick={() => setFilter('all')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>All Animals</span>
                  {filter === 'all' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.all} animals</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                filter === 'cats' && "border-primary border-2"
              )}
              onClick={() => setFilter('cats')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Cats Only</span>
                  {filter === 'cats' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.cats} cats</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                filter === 'dogs' && "border-primary border-2"
              )}
              onClick={() => setFilter('dogs')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Dogs Only</span>
                  {filter === 'dogs' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.dogs} dogs</span>
              </div>
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">By Status (Coming Soon)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-md p-3 opacity-70">
              <div className="flex flex-col">
                <span>Needs Help</span>
                <span className="text-xs text-gray-500 mt-1">{counts.needsHelp} animals</span>
              </div>
            </div>
            
            <div className="border rounded-md p-3 opacity-70">
              <div className="flex flex-col">
                <span>Being Helped</span>
                <span className="text-xs text-gray-500 mt-1">{counts.beingHelped} animals</span>
              </div>
            </div>
            
            <div className="border rounded-md p-3 opacity-70">
              <div className="flex flex-col">
                <span>Adopted</span>
                <span className="text-xs text-gray-500 mt-1">{counts.adopted} animals</span>
              </div>
            </div>
            
            <div className="border rounded-md p-3 opacity-70">
              <div className="flex flex-col">
                <span>Reported</span>
                <span className="text-xs text-gray-500 mt-1">{counts.reported} animals</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Status filtering will be available in the next update</p>
        </div>
      </div>
    </div>
  );
};
