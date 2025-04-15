
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, List } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

const Navigation = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav className="flex items-center gap-1 md:gap-4">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
          ${isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`
        }
      >
        <MapPin className="w-4 h-4" />
        {!isMobile && <span>Map</span>}
      </NavLink>
      
      <NavLink 
        to="/animals" 
        className={({ isActive }) => 
          `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
          ${isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`
        }
      >
        <List className="w-4 h-4" />
        {!isMobile && <span>Animals List</span>}
      </NavLink>
    </nav>
  );
};

export default Navigation;
