
import React, { useState, useEffect } from 'react';
import { Search, MapPin, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  id: string;
  name: string;
  description?: string;
  coordinates: [number, number];
  type: 'result' | 'recent';
}

interface MapSearchSuggestionsProps {
  onSelectLocation: (coordinates: [number, number], name: string) => void;
}

const MapSearchSuggestions: React.FC<MapSearchSuggestionsProps> = ({ onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Suggestion[]>([]);
  const { mapboxToken } = useMap();
  const { toast } = useToast();

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentMapSearches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        setRecentSearches(parsed);
      } catch (error) {
        console.error('Failed to parse recent searches', error);
      }
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2 || !mapboxToken) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // This would normally call the Mapbox Geocoding API
        // For now, we'll simulate it with mock data
        setTimeout(() => {
          const mockResults: Suggestion[] = [
            {
              id: '1',
              name: `${searchQuery} Park`,
              description: 'Park • City Center',
              coordinates: [-0.12, 51.51],
              type: 'result'
            },
            {
              id: '2',
              name: `${searchQuery} Square`,
              description: 'Public Square • Downtown',
              coordinates: [-0.13, 51.52],
              type: 'result'
            },
            {
              id: '3',
              name: `${searchQuery} Garden`,
              description: 'Garden • North Side',
              coordinates: [-0.14, 51.53],
              type: 'result'
            }
          ];
          setSuggestions(mockResults);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch location suggestions',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, mapboxToken, toast]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onSelectLocation(suggestion.coordinates, suggestion.name);
    
    // Add to recent searches
    const newRecent = {
      ...suggestion,
      type: 'recent' as const
    };
    
    const updatedRecent = [
      newRecent,
      ...recentSearches.filter(item => item.id !== suggestion.id).slice(0, 4)
    ];
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentMapSearches', JSON.stringify(updatedRecent));
    
    // Clear search
    setSearchQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentMapSearches');
    toast({
      title: 'Recent Searches Cleared',
      description: 'Your search history has been cleared'
    });
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search locations..."
          className="pl-9 h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {(suggestions.length > 0 || (recentSearches.length > 0 && !searchQuery)) && (
        <div className="mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {isLoading && (
            <div className="p-2 text-sm text-gray-500 animate-pulse">
              Searching...
            </div>
          )}
          
          {!searchQuery && recentSearches.length > 0 && (
            <>
              <div className="p-2 flex justify-between items-center">
                <h3 className="text-xs font-medium text-gray-500">Recent Searches</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-gray-500"
                  onClick={clearRecentSearches}
                >
                  Clear
                </Button>
              </div>
              <ul>
                {recentSearches.map((item) => (
                  <li 
                    key={item.id}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <div className="flex items-start gap-2">
                      <History className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {suggestions.length > 0 && searchQuery && (
            <ul>
              {suggestions.map((item) => (
                <li 
                  key={item.id}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500">{item.description}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSearchSuggestions;
