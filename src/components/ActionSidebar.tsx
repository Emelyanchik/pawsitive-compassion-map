
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMap } from '@/contexts/MapContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  Heart, 
  AlertTriangle, 
  Home, 
  User, 
  BarChart4, 
  MessageCircle, 
  DollarSign, 
  Menu, 
  X,
  Plus,
  Cat,
  Dog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddAnimalForm } from './AddAnimalForm';
import { AnimalDetails } from './AnimalDetails';
import { DonateForm } from './DonateForm';
import { FilterPanel } from './FilterPanel';
import { SearchPanel } from './SearchPanel';
import { ReportPanel } from './ReportPanel';
import { StatsPanel } from './StatsPanel';
import { ProfilePanel } from './ProfilePanel';

type ActivePanel = 'none' | 'add' | 'search' | 'filter' | 'donate' | 'report' | 'stats' | 'profile';

const ActionSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const { filter, setFilter, selectedAnimal } = useMap();
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  
  const openPanel = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
    if (isCollapsed) setIsCollapsed(false);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'add':
        return <AddAnimalForm onClose={() => setActivePanel('none')} />;
      case 'search':
        return <SearchPanel onClose={() => setActivePanel('none')} />;
      case 'filter':
        return <FilterPanel onClose={() => setActivePanel('none')} />;
      case 'donate':
        return <DonateForm onClose={() => setActivePanel('none')} />;
      case 'report':
        return <ReportPanel onClose={() => setActivePanel('none')} />;
      case 'stats':
        return <StatsPanel onClose={() => setActivePanel('none')} />;
      case 'profile':
        return <ProfilePanel onClose={() => setActivePanel('none')} />;
      default:
        return selectedAnimal ? <AnimalDetails /> : null;
    }
  };

  return (
    <div className={cn(
      "fixed right-0 top-0 z-40 h-screen transition-all duration-300 flex",
      isCollapsed ? "w-16" : activePanel !== 'none' || selectedAnimal ? "w-96" : "w-16"
    )}>
      {/* Main sidebar with action buttons */}
      <div className="h-full flex flex-col bg-white shadow-lg border-l border-gray-200 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="self-start m-2" 
          onClick={toggleSidebar}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>

        <ScrollArea className="flex-1 py-4">
          <div className="flex flex-col items-center gap-6">
            <Button
              variant={activePanel === 'add' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-petmap-purple text-white hover:bg-petmap-purple/90"
              onClick={() => openPanel('add')}
              title="Add Animal"
            >
              <Plus className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'search' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('search')}
              title="Search"
            >
              <Search className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'filter' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('filter')}
              title="Filter"
            >
              <Filter className="h-6 w-6" />
            </Button>
            
            <Separator className="w-8 bg-gray-200" />
            
            {/* Filter shortcuts */}
            <Button
              variant={filter === 'all' ? "default" : "ghost"}
              size="icon"
              className={cn(
                "rounded-full h-12 w-12 border", 
                filter === 'all' 
                  ? "bg-petmap-blue text-white hover:bg-petmap-blue/90" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              )}
              onClick={() => setFilter('all')}
              title="All Pets"
            >
              <MapPin className="h-6 w-6" />
            </Button>
            
            <Button
              variant={filter === 'cats' ? "default" : "ghost"}
              size="icon"
              className={cn(
                "rounded-full h-12 w-12 border", 
                filter === 'cats' 
                  ? "bg-petmap-green text-white hover:bg-petmap-green/90" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              )}
              onClick={() => setFilter('cats')}
              title="Cats Only"
            >
              <Cat className="h-6 w-6" />
            </Button>
            
            <Button
              variant={filter === 'dogs' ? "default" : "ghost"}
              size="icon"
              className={cn(
                "rounded-full h-12 w-12 border", 
                filter === 'dogs' 
                  ? "bg-petmap-orange text-white hover:bg-petmap-orange/90" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              )}
              onClick={() => setFilter('dogs')}
              title="Dogs Only"
            >
              <Dog className="h-6 w-6" />
            </Button>
            
            <Separator className="w-8 bg-gray-200" />

            <Button
              variant={activePanel === 'donate' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('donate')}
              title="Donate"
            >
              <DollarSign className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'report' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('report')}
              title="Report Concern"
            >
              <AlertTriangle className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'stats' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('stats')}
              title="Statistics"
            >
              <BarChart4 className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'profile' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('profile')}
              title="Profile"
            >
              <User className="h-6 w-6" />
            </Button>
          </div>
        </ScrollArea>
      </div>
      
      {/* Content panel */}
      {!isCollapsed && (activePanel !== 'none' || selectedAnimal) && (
        <div className="h-full bg-white flex-1 shadow-xl border-l border-gray-200 animate-slide-in overflow-hidden">
          <ScrollArea className="h-full p-4">
            {renderActivePanel()}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ActionSidebar;
