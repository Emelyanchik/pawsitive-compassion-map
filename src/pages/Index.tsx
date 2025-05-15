
import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import AnimalListView from '@/components/AnimalListView';
import Header from '@/components/Header';
import ActionSidebar from '@/components/ActionSidebar';
import StatusFilterCards from '@/components/StatusFilterCards';
import { Moon, Sun, Map, List, Search, Share2, Bookmark, AlertCircle, Bell, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMap } from '@/contexts/MapContext';
import QuickStatsBanner from '@/components/QuickStatsBanner';
import SavedAnimalsPanel from '@/components/SavedAnimalsPanel';
import { useToast } from '@/hooks/use-toast';
import WeatherSummaryWidget from '@/components/WeatherSummaryWidget';
import TopNotificationBanner from '@/components/TopNotificationBanner';
import MapShareDialog from '@/components/MapShareDialog';
import NotificationsPanel from '@/components/NotificationsPanel';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import MapSearchSuggestions from '@/components/MapSearchSuggestions';
import MapFilterPopup from '@/components/MapFilterPopup';
import FeedbackDialog from '@/components/FeedbackDialog';
import WelcomeTour from '@/components/WelcomeTour';
import AnimalHeatmapToggle from '@/components/AnimalHeatmapToggle';
import DirectionsPanel from '@/components/DirectionsPanel';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedAnimals, setShowSavedAnimals] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mapShareOpen, setMapShareOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [activeHeatmap, setActiveHeatmap] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const { animals, userLocation, mapRotation, mapPitch, filter, statusFilter, distanceFilter, selectedAnimal } = useMap();
  const { toast } = useToast();

  // Mock current map view for sharing
  const [currentMapView, setCurrentMapView] = useState({
    center: userLocation || [-0.127, 51.507],
    zoom: 14,
    pitch: mapPitch,
    bearing: mapRotation
  });

  // Check if user is a first-time visitor
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('petmap-tour-completed');
    if (isFirstVisit) {
      // Wait a moment before showing the tour to let the UI load first
      const timer = setTimeout(() => {
        setShowWelcomeTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update current map view when the map changes
  useEffect(() => {
    setCurrentMapView(prev => ({
      ...prev,
      center: userLocation || prev.center,
      pitch: mapPitch,
      bearing: mapRotation
    }));
  }, [userLocation, mapPitch, mapRotation]);

  useEffect(() => {
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
    
    // Check if first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setWelcomeVisible(false);
    } else {
      localStorage.setItem('hasVisited', 'true');
    }

    // Check for saved view mode preference
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode as 'map' | 'list');
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    // Save view mode preference
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const dismissWelcome = () => {
    setWelcomeVisible(false);
  };

  const handleLocationSelect = (coordinates: [number, number], name: string) => {
    // We would typically pass this to map component
    toast({
      title: "Location Selected",
      description: `Going to ${name}`,
    });
    // This would be implemented in the Map component to fly to the location
  };

  const shareLocation = async () => {
    if (userLocation) {
      try {
        await navigator.share({
          title: 'My location on PetMap',
          text: 'Check this location on PetMap!',
          url: `https://maps.google.com/?q=${userLocation[1]},${userLocation[0]}`,
        });
        toast({
          title: "Location Shared",
          description: "Your current location has been shared!",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing Failed",
            description: "Could not share your location. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Location Unavailable",
        description: "Please enable location services to share your position.",
        variant: "destructive",
      });
    }
  };

  const openWeatherPanel = () => {
    // This would communicate with the ActionSidebar to open the weather panel
    // For now, we'll just show a toast message
    toast({
      title: "Weather Details",
      description: "Open the sidebar and click on the weather icon for detailed information.",
    });
  };

  const openShareMapDialog = () => {
    setMapShareOpen(true);
  };
  
  const getActiveFilterCount = () => {
    return [
      filter !== 'all' ? 1 : 0,
      statusFilter ? 1 : 0,
      distanceFilter > 0 ? 1 : 0
    ].reduce((a, b) => a + b, 0);
  };

  const handleToggleHeatmap = (type: string | null) => {
    setActiveHeatmap(type);
    
    if (type) {
      toast({
        title: "Heatmap Enabled",
        description: `Showing ${type === 'all' ? 'all animal' : type} density on the map.`,
      });
    }
  };

  const handleOpenDirections = () => {
    if (!selectedAnimal && !userLocation) {
      toast({
        title: "No Location Available",
        description: "Please select an animal or enable your location to use directions.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDirections(true);
  };

  const handleShowFeedback = () => {
    setShowFeedbackDialog(true);
  };

  // Calculate quick stats
  const needsHelpCount = animals.filter(a => a.status === 'needs_help').length;
  const totalAnimalsCount = animals.length;

  return (
    <div className={`h-screen w-full overflow-hidden ${darkMode ? 'dark' : ''}`} style={{
      // Added CSS variables for pet map colors
      '--petmap-orange': '#FFA500',
      '--petmap-green': '#32CD32',
      '--petmap-purple': '#9B30FF',
      '--petmap-blue': '#0EA5E9'
    } as React.CSSProperties}>
      <TopNotificationBanner />
      <Header />
      <div className="pt-14 h-full relative flex flex-col">
        {/* Search bar and quick actions */}
        <div className="z-20 bg-white dark:bg-gray-800 shadow-sm p-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <MapSearchSuggestions onSelectLocation={handleLocationSelect} />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {userLocation && (
              <div className="mr-2">
                <WeatherSummaryWidget onClick={openWeatherPanel} />
              </div>
            )}
            
            <AnimalHeatmapToggle 
              onToggleHeatmap={handleToggleHeatmap} 
              activeHeatmap={activeHeatmap}
            />
            
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex items-center gap-1"
              onClick={handleOpenDirections}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Directions</span>
            </Button>
            
            <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 flex items-center gap-1 relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-xs"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <MapFilterPopup onClose={() => setShowFilterPopover(false)} />
              </PopoverContent>
            </Popover>
            
            <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 relative"
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 min-w-[1rem] p-0 flex items-center justify-center text-[10px]"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 pt-12">
                <NotificationsPanel />
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 flex items-center gap-1"
              onClick={() => setShowSavedAnimals(true)}
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full">3</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 flex items-center gap-1"
              onClick={shareLocation}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share Location</span>
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 flex items-center gap-1 hidden sm:flex"
              onClick={openShareMapDialog}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Share Map View</span>
            </Button>
          </div>
        </div>
        
        {/* Quick stats banner */}
        <QuickStatsBanner needsHelpCount={needsHelpCount} totalCount={totalAnimalsCount} />
        
        {/* Status filter cards */}
        <div className="z-10 bg-white dark:bg-gray-800 shadow-sm">
          <StatusFilterCards />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === 'map' ? <MapComponent /> : <AnimalListView />}
        </div>
        
        {/* Dark mode toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 z-10 rounded-full bg-white dark:bg-gray-800 shadow-md"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* View mode toggle */}
        <div className="absolute top-4 left-20 z-10">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'map' | 'list')}>
            <ToggleGroupItem value="map" aria-label="Map View" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Map className="h-4 w-4 mr-2" />
              Map
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List View" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <List className="h-4 w-4 mr-2" />
              List
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Feedback button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 shadow-md"
          onClick={handleShowFeedback}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Feedback
        </Button>

        {/* Mobile share map button - only visible on small screens */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full bg-white dark:bg-gray-800 shadow-md sm:hidden"
          onClick={openShareMapDialog}
        >
          <ExternalLink className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Welcome overlay for first-time users */}
      {welcomeVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to PetMap!</h2>
            <p className="mb-3">PetMap helps you locate and help animals in need around your area.</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Report animals that need help</li>
              <li>Volunteer to help animals</li>
              <li>Track animal status updates</li>
              <li>Earn tokens for your contributions</li>
            </ul>
            <Button onClick={dismissWelcome} className="w-full">Get Started</Button>
          </div>
        </div>
      )}
      
      {/* Saved animals panel */}
      <SavedAnimalsPanel open={showSavedAnimals} onClose={() => setShowSavedAnimals(false)} />
      
      {/* Map Share Dialog */}
      <MapShareDialog
        open={mapShareOpen}
        onOpenChange={setMapShareOpen}
        currentView={currentMapView as {center: [number, number], zoom: number, pitch: number, bearing: number}}
      />
      
      {/* New components */}
      <FeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
      />
      
      {showWelcomeTour && <WelcomeTour onComplete={() => setShowWelcomeTour(false)} />}
      
      {/* Directions Panel as a Drawer */}
      <Sheet open={showDirections} onOpenChange={setShowDirections}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 pt-12">
          <DirectionsPanel 
            onClose={() => setShowDirections(false)} 
            animalLocation={selectedAnimal ? [selectedAnimal.longitude, selectedAnimal.latitude] : undefined}
          />
        </SheetContent>
      </Sheet>
      
      <ActionSidebar />
    </div>
  );
};

export default Index;
