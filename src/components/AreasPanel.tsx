
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MapPin, Trash2, Eye, EyeOff, Edit, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMap } from '@/contexts/MapContext';
import { AreaLabel } from '@/contexts/MapContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AreasPanelProps {
  onClose: () => void;
}

export const AreasPanel: React.FC<AreasPanelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { areaLabels, removeAreaLabel, toggleAreaVisibility } = useMap();
  const { toast } = useToast();

  const filteredAreas = areaLabels.filter(area => 
    area.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (area.description && area.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRemoveArea = (id: string, label: string) => {
    removeAreaLabel(id);
    toast({
      title: "Area Removed",
      description: `"${label}" has been removed successfully.`,
    });
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    toggleAreaVisibility(id);
    toast({
      title: isVisible ? "Area Hidden" : "Area Visible",
      description: `The area is now ${isVisible ? 'hidden' : 'visible'} on the map.`,
    });
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
        <MapPin className="h-5 w-5" />
        <h2 className="text-xl font-bold">Marked Areas</h2>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search areas..."
          className="pl-10"
        />
      </div>
      
      {filteredAreas.length > 0 ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredAreas.map((area) => (
              <div 
                key={area.id} 
                className={cn(
                  "p-4 border rounded-md",
                  area.visible === false ? "bg-gray-50 dark:bg-gray-800/50 opacity-60" : ""
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{area.label}</h3>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleToggleVisibility(area.id, area.visible !== false)}
                      title={area.visible === false ? "Show Area" : "Hide Area"}
                    >
                      {area.visible === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveArea(area.id, area.label)}
                      title="Delete Area"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {area.description && (
                  <p className="text-sm text-gray-600 mb-2">{area.description}</p>
                )}
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <Badge variant="outline" className="text-xs">
                    {area.coordinates.length} points
                  </Badge>
                  <span>
                    Created {format(new Date(area.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? (
            <p>No areas found matching your search.</p>
          ) : (
            <div>
              <p className="mb-2">No areas have been marked yet.</p>
              <p className="text-sm">Use the "Mark Area" button on the map to create your first area.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
