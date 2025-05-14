
import React from 'react';
import { Button } from '@/components/ui/button';
import { Ruler, Navigation, Target } from 'lucide-react';

interface MapToolsPopupProps {
  activeTool: string | null;
  onSelectTool: (tool: string) => void;
  isLiveTracking: boolean;
  onToggleTracking: () => void;
  hasMeasurePoints: boolean;
  onResetMeasurement: () => void;
}

const MapToolsPopup: React.FC<MapToolsPopupProps> = ({
  activeTool,
  onSelectTool,
  isLiveTracking,
  onToggleTracking,
  hasMeasurePoints,
  onResetMeasurement
}) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col gap-2 min-w-[200px] animate-fade-in">
      <h4 className="font-medium text-sm text-gray-500 mb-1">Map Tools</h4>
      
      <Button 
        variant={activeTool === 'measure' ? "default" : "outline"}
        size="sm"
        className="flex items-center justify-start gap-2"
        onClick={() => onSelectTool('measure')}
      >
        <Ruler className="w-4 h-4" />
        <span>Measure Distance</span>
      </Button>
      
      <Button 
        variant={isLiveTracking ? "default" : "outline"}
        size="sm"
        className="flex items-center justify-start gap-2"
        onClick={onToggleTracking}
      >
        <Navigation className="w-4 h-4" />
        <span>{isLiveTracking ? 'Stop Tracking' : 'Live Location'}</span>
      </Button>
      
      {activeTool === 'measure' && hasMeasurePoints && (
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50"
          onClick={onResetMeasurement}
        >
          <Target className="w-4 h-4" />
          <span>Reset Measurement</span>
        </Button>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        {activeTool === 'measure' ? 
          'Click on the map to add measurement points' : 
          isLiveTracking ? 
          'Your location is being tracked in real-time' : 
          'Select a tool to begin'
        }
      </div>
    </div>
  );
};

export default MapToolsPopup;
