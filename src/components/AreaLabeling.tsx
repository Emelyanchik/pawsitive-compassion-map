
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMap } from '@/contexts/MapContext';
import { BookmarkPlus, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';

interface AreaLabelingProps {
  map: mapboxgl.Map | null;
}

const AreaLabeling: React.FC<AreaLabelingProps> = ({ map }) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [areaLabel, setAreaLabel] = useState('');
  const [areaDescription, setAreaDescription] = useState('');
  const { addAreaLabel } = useMap();
  const { toast } = useToast();

  // Enable/disable drawing mode
  const toggleDrawingMode = () => {
    if (isDrawingMode) {
      // If currently in drawing mode, finish the drawing
      if (drawPoints.length >= 3) {
        setIsLabelDialogOpen(true);
      } else {
        toast({
          title: "Not enough points",
          description: "Please mark at least 3 points to create an area.",
          variant: "destructive",
        });
        resetDrawing();
      }
    } else {
      // Start drawing mode
      setIsDrawingMode(true);
      setDrawPoints([]);
      toast({
        title: "Area Drawing Mode",
        description: "Click on the map to add points. Click 'Finish Area' when done.",
      });
    }
  };

  const resetDrawing = () => {
    setIsDrawingMode(false);
    setDrawPoints([]);
    // Remove temporary drawing layer if it exists
    if (map && map.getLayer('area-drawing-fill')) {
      map.removeLayer('area-drawing-fill');
    }
    if (map && map.getLayer('area-drawing-outline')) {
      map.removeLayer('area-drawing-outline');
    }
    if (map && map.getSource('area-drawing')) {
      map.removeSource('area-drawing');
    }
  };

  // Handle map clicks when in drawing mode
  useEffect(() => {
    if (!map || !isDrawingMode) return;

    const clickHandler = (e: mapboxgl.MapMouseEvent) => {
      if (!isDrawingMode) return;

      const { lng, lat } = e.lngLat;
      const newPoint: [number, number] = [lng, lat];
      
      setDrawPoints(prevPoints => [...prevPoints, newPoint]);
      
      // Update the drawing on the map
      updateDrawingOnMap(map, [...drawPoints, newPoint]);
    };

    map.on('click', clickHandler);

    return () => {
      map.off('click', clickHandler);
    };
  }, [map, isDrawingMode, drawPoints]);

  // Update the drawing on the map
  const updateDrawingOnMap = (map: mapboxgl.Map, points: [number, number][]) => {
    if (points.length < 2) return;

    const sourceId = 'area-drawing';
    const fillLayerId = 'area-drawing-fill';
    const outlineLayerId = 'area-drawing-outline';

    // Create a polygon from the points
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            ...points,
            // Close the polygon if we have at least 3 points
            points.length >= 3 ? points[0] : points[points.length - 1]
          ]
        ]
      }
    };

    // Add or update the source
    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: [polygon]
      });
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [polygon]
        }
      });

      // Add fill layer
      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#0ea5e9',
          'fill-opacity': 0.3
        }
      });

      // Add outline layer
      map.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#0ea5e9',
          'line-width': 2
        }
      });
    }
  };

  // Save the area with label
  const saveAreaLabel = () => {
    if (!areaLabel.trim()) {
      toast({
        title: "Label Required",
        description: "Please enter a label for this area.",
        variant: "destructive",
      });
      return;
    }

    if (drawPoints.length >= 3) {
      addAreaLabel({
        id: Date.now().toString(),
        label: areaLabel,
        description: areaDescription,
        coordinates: drawPoints,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Area Saved",
        description: `"${areaLabel}" has been saved successfully.`,
      });
    }

    setIsLabelDialogOpen(false);
    resetDrawing();
  };

  return (
    <>
      <div className="absolute bottom-4 left-20 flex gap-2">
        <Button 
          variant={isDrawingMode ? "destructive" : "secondary"}
          size="sm"
          className={`flex items-center gap-1 bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 ${isDrawingMode ? 'border-red-500 border-2' : ''}`}
          onClick={toggleDrawingMode}
        >
          {isDrawingMode ? 'Finish Area' : 'Mark Area'}
        </Button>
        
        {isDrawingMode && (
          <Button 
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={resetDrawing}
          >
            Cancel
          </Button>
        )}
      </div>

      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Label This Area</DialogTitle>
            <DialogDescription>
              Add a name and description for this marked area.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Area Name
              </label>
              <Input
                id="name"
                value={areaLabel}
                onChange={(e) => setAreaLabel(e.target.value)}
                placeholder="e.g., High Concentration Area"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                id="description"
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                placeholder="e.g., Multiple stray cats spotted here regularly"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAreaLabel}>
              Save Area
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AreaLabeling;
