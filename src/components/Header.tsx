
import React from 'react';
import { MapPin } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const { filter, setFilter } = useMap();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-petmap-purple to-petmap-blue py-3 px-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-white" />
        <h1 className="text-xl font-bold text-white">PetMap</h1>
      </div>
      
      <div className="flex gap-4">
        <button 
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors",
            filter === 'all' 
              ? "bg-white text-primary" 
              : "bg-transparent text-white hover:bg-white/20"
          )}
          onClick={() => setFilter('all')}
        >
          All Pets
        </button>
        
        <button 
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors",
            filter === 'cats' 
              ? "bg-white text-primary" 
              : "bg-transparent text-white hover:bg-white/20"
          )}
          onClick={() => setFilter('cats')}
        >
          Cats Only
        </button>
        
        <button 
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors",
            filter === 'dogs' 
              ? "bg-white text-primary" 
              : "bg-transparent text-white hover:bg-white/20"
          )}
          onClick={() => setFilter('dogs')}
        >
          Dogs Only
        </button>
      </div>
    </header>
  );
};

export default Header;
