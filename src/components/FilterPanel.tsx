
import React, { useState } from 'react';
import { X, Filter, Check, Ruler, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { filter, setFilter, animals, setDistanceFilter, distanceFilter, userLocation } = useMap();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
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

  const form = useForm({
    defaultValues: {
      distance: distanceFilter,
    }
  });

  const handleDistanceChange = (value: number[]) => {
    setDistanceFilter(value[0]);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(prev => prev === status ? null : status);
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
        
        <div className="space-y-4">
          <h3 className="font-medium mb-3">Search Radius</h3>
          <div className="px-2">
            {userLocation ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Distance: {distanceFilter} km</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Ruler className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <Form {...form}>
                        <FormField
                          control={form.control}
                          name="distance"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Exact distance (km)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={50}
                                  value={field.value}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 1 && value <= 50) {
                                      field.onChange(value);
                                      setDistanceFilter(value);
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </Form>
                    </PopoverContent>
                  </Popover>
                </div>
                <Slider
                  defaultValue={[distanceFilter]}
                  max={50}
                  min={1}
                  step={1}
                  value={[distanceFilter]}
                  onValueChange={handleDistanceChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 p-3 border rounded-md border-yellow-300 bg-yellow-50 text-yellow-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Location access required for distance filtering</span>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">By Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                statusFilter === 'needs_help' && "border-red-500 border-2"
              )}
              onClick={() => handleStatusFilter('needs_help')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Needs Help</span>
                  {statusFilter === 'needs_help' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.needsHelp} animals</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                statusFilter === 'being_helped' && "border-orange-500 border-2"
              )}
              onClick={() => handleStatusFilter('being_helped')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Being Helped</span>
                  {statusFilter === 'being_helped' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.beingHelped} animals</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                statusFilter === 'adopted' && "border-green-500 border-2"
              )}
              onClick={() => handleStatusFilter('adopted')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Adopted</span>
                  {statusFilter === 'adopted' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.adopted} animals</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "justify-start h-auto py-3",
                statusFilter === 'reported' && "border-purple-500 border-2"
              )}
              onClick={() => handleStatusFilter('reported')}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center w-full">
                  <span>Reported</span>
                  {statusFilter === 'reported' && <Check className="h-4 w-4 ml-auto" />}
                </div>
                <span className="text-xs text-gray-500 mt-1">{counts.reported} animals</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
