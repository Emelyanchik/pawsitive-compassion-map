
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useMap } from '@/contexts/MapContext';
import { Badge } from '@/components/ui/badge';

const MapFilterPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    filter, 
    setFilter, 
    statusFilter, 
    setStatusFilter, 
    distanceFilter, 
    setDistanceFilter 
  } = useMap();
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSpeciesFilter, setShowSpeciesFilter] = useState(filter !== 'all');
  const [showStatusFilter, setShowStatusFilter] = useState(!!statusFilter);
  const [showDistanceFilter, setShowDistanceFilter] = useState(distanceFilter > 0);

  // Update filter counts
  const filterCount = [
    filter !== 'all' ? 1 : 0,
    statusFilter ? 1 : 0,
    distanceFilter > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  const handleSpeciesChange = (value: string) => {
    setFilter(value as 'all' | 'cats' | 'dogs');
  };
  
  const handleStatusChange = (value: string | null) => {
    setStatusFilter(value);
  };
  
  const handleDistanceChange = (value: number[]) => {
    setDistanceFilter(value[0]);
  };
  
  const resetFilters = () => {
    setFilter('all');
    setStatusFilter(null);
    setDistanceFilter(0);
    setActiveFilters([]);
    setShowSpeciesFilter(false);
    setShowStatusFilter(false);
    setShowDistanceFilter(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Map Filters</h3>
        {filterCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {filterCount} active
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={showSpeciesFilter ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowSpeciesFilter(!showSpeciesFilter)}
            className="text-xs"
          >
            Animal Type
          </Button>
          <Button 
            variant={showStatusFilter ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className="text-xs"
          >
            Status
          </Button>
          <Button 
            variant={showDistanceFilter ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowDistanceFilter(!showDistanceFilter)}
            className="text-xs"
          >
            Distance
          </Button>
        </div>
        
        {showSpeciesFilter && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <h4 className="text-sm font-medium mb-2">Animal Type</h4>
            <div className="flex gap-3">
              <Button 
                variant={filter === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSpeciesChange('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'cats' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSpeciesChange('cats')}
              >
                Cats
              </Button>
              <Button 
                variant={filter === 'dogs' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSpeciesChange('dogs')}
              >
                Dogs
              </Button>
            </div>
          </div>
        )}
        
        {showStatusFilter && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={statusFilter === null ? "default" : "outline"} 
                size="sm"
                onClick={() => handleStatusChange(null)}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'needs_help' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleStatusChange('needs_help')}
                className="border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100"
              >
                Needs Help
              </Button>
              <Button 
                variant={statusFilter === 'being_helped' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleStatusChange('being_helped')}
                className="border-yellow-200 text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              >
                Being Helped
              </Button>
              <Button 
                variant={statusFilter === 'reported' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleStatusChange('reported')}
                className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
              >
                Reported
              </Button>
              <Button 
                variant={statusFilter === 'adopted' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleStatusChange('adopted')}
                className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
              >
                Adopted
              </Button>
            </div>
          </div>
        )}
        
        {showDistanceFilter && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium">Distance</h4>
              <span className="text-sm text-gray-500">{distanceFilter} km</span>
            </div>
            <Slider
              defaultValue={[distanceFilter]}
              max={50}
              step={1}
              onValueChange={handleDistanceChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 km</span>
              <span>50 km</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset All
        </Button>
        <Button onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default MapFilterPopup;
