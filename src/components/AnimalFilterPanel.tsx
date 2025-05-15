
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMap } from "@/contexts/MapContext";
import { Button } from "@/components/ui/button";

const AnimalFilterPanel = () => {
  const { 
    filter, 
    setFilter,
    distanceFilter, 
    setDistanceFilter,
    statusFilter,
    setStatusFilter,
    animals,
    filteredAnimals
  } = useMap();

  // Count of animals by type and status for display in badges
  const catCount = animals.filter(a => a.type === 'cat').length;
  const dogCount = animals.filter(a => a.type === 'dog').length;
  const otherCount = animals.filter(a => a.type === 'other').length;
  
  const needsHelpCount = animals.filter(a => a.status === 'needs_help').length;
  const beingHelpedCount = animals.filter(a => a.status === 'being_helped').length;
  const reportedCount = animals.filter(a => a.status === 'reported').length;
  const adoptedCount = animals.filter(a => a.status === 'adopted').length;

  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Animal Types</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex items-center gap-1"
          >
            All
            <Badge variant="secondary" className="ml-1">
              {animals.length}
            </Badge>
          </Button>

          <Button
            variant={filter === 'cats' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('cats')}
            className="flex items-center gap-1"
          >
            Cats
            <Badge variant="secondary" className="ml-1">
              {catCount}
            </Badge>
          </Button>

          <Button
            variant={filter === 'dogs' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('dogs')}
            className="flex items-center gap-1"
          >
            Dogs
            <Badge variant="secondary" className="ml-1">
              {dogCount}
            </Badge>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex items-center gap-1"
          >
            Other
            <Badge variant="secondary" className="ml-1">
              {otherCount}
            </Badge>
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Animal Status</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={statusFilter === 'needs_help' ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilterChange('needs_help')}
            className={`flex items-center justify-between gap-1 ${
              statusFilter === 'needs_help' ? '' : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            <span>Needs Help</span>
            <Badge variant={statusFilter === 'needs_help' ? "outline" : "secondary"} className="ml-1">
              {needsHelpCount}
            </Badge>
          </Button>

          <Button
            variant={statusFilter === 'being_helped' ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilterChange('being_helped')}
            className={`flex items-center justify-between gap-1 ${
              statusFilter === 'being_helped' ? '' : 'border-orange-200 text-orange-600 hover:bg-orange-50'
            }`}
          >
            <span>Being Helped</span>
            <Badge variant={statusFilter === 'being_helped' ? "outline" : "secondary"} className="ml-1">
              {beingHelpedCount}
            </Badge>
          </Button>

          <Button
            variant={statusFilter === 'reported' ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilterChange('reported')}
            className={`flex items-center justify-between gap-1 ${
              statusFilter === 'reported' ? '' : 'border-purple-200 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <span>Reported</span>
            <Badge variant={statusFilter === 'reported' ? "outline" : "secondary"} className="ml-1">
              {reportedCount}
            </Badge>
          </Button>

          <Button
            variant={statusFilter === 'adopted' ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilterChange('adopted')}
            className={`flex items-center justify-between gap-1 ${
              statusFilter === 'adopted' ? '' : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            <span>Adopted</span>
            <Badge variant={statusFilter === 'adopted' ? "outline" : "secondary"} className="ml-1">
              {adoptedCount}
            </Badge>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="distance-slider" className="text-sm font-medium">
            Distance Filter
          </Label>
          <span className="text-sm text-gray-500">{distanceFilter} km</span>
        </div>
        <Slider
          id="distance-slider"
          value={[distanceFilter]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => setDistanceFilter(value[0])}
          className="mb-6"
        />
        <div className="text-xs text-gray-500 flex justify-between">
          <span>No limit</span>
          <span>50 km</span>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Filtered animals:</span>
            <span className="font-medium">{filteredAnimals.length}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Total animals:</span>
            <span className="font-medium">{animals.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalFilterPanel;
