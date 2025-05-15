
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Flame, ChevronDown, Cat, Dog, AlertCircle, Check } from 'lucide-react';

interface AnimalHeatmapToggleProps {
  onToggleHeatmap: (type: string | null) => void;
  activeHeatmap: string | null;
}

const AnimalHeatmapToggle: React.FC<AnimalHeatmapToggleProps> = ({
  onToggleHeatmap,
  activeHeatmap
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={activeHeatmap ? "default" : "outline"}
          size="sm" 
          className="flex items-center gap-1"
        >
          <Flame className="h-4 w-4" />
          <span>Heatmap</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Show Animal Density</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onToggleHeatmap('all')}
          className="flex items-center justify-between"
        >
          All Animals
          {activeHeatmap === 'all' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleHeatmap('cats')}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <Cat className="h-4 w-4 mr-2" />
            <span>Cats Only</span>
          </div>
          {activeHeatmap === 'cats' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleHeatmap('dogs')}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <Dog className="h-4 w-4 mr-2" />
            <span>Dogs Only</span>
          </div>
          {activeHeatmap === 'dogs' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleHeatmap('needs_help')}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Needs Help</span>
          </div>
          {activeHeatmap === 'needs_help' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onToggleHeatmap(null)}
          disabled={!activeHeatmap}
        >
          Turn Off Heatmap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AnimalHeatmapToggle;
