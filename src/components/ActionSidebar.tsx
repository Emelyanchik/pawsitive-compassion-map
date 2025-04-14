
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
  Dog,
  Settings,
  HelpCircle,
  Share2,
  Info,
  Map,
  CalendarDays,
  Bookmark,
  Bell,
  HandHelping,
  BadgePercent,
  Coins
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
import { VolunteerPanel } from './VolunteerPanel';
import { TokenHoldersPanel } from './TokenHoldersPanel';
import { TokenConversionPanel } from './TokenConversionPanel';
import { useToast } from '@/hooks/use-toast';

type ActivePanel = 'none' | 'add' | 'search' | 'filter' | 'donate' | 'report' | 'stats' | 'profile' | 'help' | 'share' | 'settings' | 'events' | 'saved' | 'notifications' | 'volunteer' | 'token-holders' | 'token-conversion';

const ActionSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const { filter, setFilter, selectedAnimal } = useMap();
  const { toast } = useToast();
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  
  const openPanel = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
    if (isCollapsed) setIsCollapsed(false);
  };

  const showComingSoonToast = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature will be available in a future update.`,
    });
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
      case 'volunteer':
        return <VolunteerPanel onClose={() => setActivePanel('none')} />;
      case 'token-holders':
        return <TokenHoldersPanel onClose={() => setActivePanel('none')} />;
      case 'token-conversion':
        return <TokenConversionPanel onClose={() => setActivePanel('none')} />;
      // New panels will be implemented in future updates
      case 'help':
      case 'share':
      case 'settings':
      case 'events':
      case 'saved':
      case 'notifications':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
            <p>This feature is under development and will be available in a future update.</p>
            <Button 
              className="mt-4" 
              onClick={() => setActivePanel('none')}
            >
              Close
            </Button>
          </div>
        );
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
          <div className="flex flex-col items-center gap-3">
            {/* Primary Actions */}
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
            
            {/* New Volunteer Button */}
            <Button
              variant={activePanel === 'volunteer' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
              onClick={() => openPanel('volunteer')}
              title="Become a Volunteer"
            >
              <HandHelping className="h-6 w-6" />
            </Button>
            
            <Separator className="w-8 bg-gray-200" />

            {/* Token Management */}
            <Button
              variant={activePanel === 'token-holders' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('token-holders')}
              title="Token Holders Ranking"
            >
              <BadgePercent className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'token-conversion' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('token-conversion')}
              title="Convert Tokens"
            >
              <Coins className="h-6 w-6" />
            </Button>

            <Separator className="w-8 bg-gray-200" />

            {/* Financial & Reporting */}
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
            
            <Separator className="w-8 bg-gray-200" />

            {/* Additional Buttons */}
            <Button
              variant={activePanel === 'help' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('help')}
              title="Help & Resources"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'share' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('share')}
              title="Share Map"
            >
              <Share2 className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'settings' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('settings')}
              title="Map Settings"
            >
              <Settings className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'events' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('events')}
              title="Pet Events"
            >
              <CalendarDays className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'saved' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('saved')}
              title="Saved Animals"
            >
              <Bookmark className="h-6 w-6" />
            </Button>
            
            <Button
              variant={activePanel === 'notifications' ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-12 w-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              onClick={() => openPanel('notifications')}
              title="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Button>
            
            <Separator className="w-8 bg-gray-200" />
            
            {/* User Settings */}
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
