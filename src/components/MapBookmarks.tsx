
import React, { useState } from 'react';
import { BookmarkIcon, Plus, X, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMap } from '@/contexts/MapContext';

interface MapBookmark {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  zoom: number;
}

const MapBookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<MapBookmark[]>([
    {
      id: '1',
      name: 'Cat Colony North Park',
      description: 'Large colony of cats near the north entrance',
      coordinates: [-0.127, 51.507],
      zoom: 15
    },
    {
      id: '2',
      name: 'Dog Shelter Area',
      description: 'Area with stray dogs near the shelter',
      coordinates: [-0.118, 51.509],
      zoom: 14
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState({
    name: '',
    description: ''
  });
  
  const { toast } = useToast();
  const { userLocation } = useMap();
  
  const handleBookmarkClick = (bookmark: MapBookmark) => {
    toast({
      title: `Going to ${bookmark.name}`,
      description: 'Map location updated',
    });
    
    // This would typically fly to the location in the map component
  };
  
  const handleAddBookmark = () => {
    if (!userLocation) {
      toast({
        title: 'Cannot add bookmark',
        description: 'Your current location is not available',
        variant: 'destructive'
      });
      return;
    }
    
    if (!newBookmark.name) {
      toast({
        title: 'Name required',
        description: 'Please provide a name for your bookmark',
        variant: 'destructive'
      });
      return;
    }
    
    const bookmark: MapBookmark = {
      id: Date.now().toString(),
      name: newBookmark.name,
      description: newBookmark.description,
      coordinates: userLocation,
      zoom: 15 // default zoom level
    };
    
    setBookmarks([...bookmarks, bookmark]);
    setNewBookmark({ name: '', description: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Bookmark added',
      description: `"${bookmark.name}" has been saved`
    });
  };
  
  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    
    toast({
      title: 'Bookmark deleted',
      description: 'The bookmark has been removed'
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5" />
          Map Bookmarks
        </h3>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </Button>
      </div>
      
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div 
            key={bookmark.id}
            className="relative flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <MapIcon className="w-4 h-4 mt-1 flex-shrink-0" />
            
            <div className="flex-1 min-w-0" onClick={() => handleBookmarkClick(bookmark)}>
              <p className="font-medium text-sm cursor-pointer">{bookmark.name}</p>
              {bookmark.description && (
                <p className="text-xs text-gray-500">{bookmark.description}</p>
              )}
            </div>
            
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              onClick={() => handleDeleteBookmark(bookmark.id)}
              aria-label="Delete bookmark"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {bookmarks.length === 0 && (
          <p className="text-sm text-gray-500">No saved bookmarks</p>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bookmark</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name"
                value={newBookmark.name}
                onChange={(e) => setNewBookmark({...newBookmark, name: e.target.value})}
                placeholder="E.g., Cat Colony Park"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
              <Input 
                id="description"
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                placeholder="Add details about this location..."
              />
            </div>
            
            <p className="text-xs text-gray-500">
              This will save your current location as a bookmark.
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBookmark}>
              Save Bookmark
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapBookmarks;
