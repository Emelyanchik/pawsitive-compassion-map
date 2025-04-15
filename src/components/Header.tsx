
import React from 'react';
import { Button } from './ui/button';
import { Coins } from 'lucide-react';
import { Badge } from './ui/badge';
import Navigation from './Navigation';
import { useMap } from '@/contexts/MapContext';

const Header = () => {
  const { userTokens } = useMap();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center px-4 shadow-sm">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg text-petmap-purple">PetMap</span>
            <Badge variant="purple" className="hidden md:inline-flex">Beta</Badge>
          </a>
          
          <Navigation />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-sm">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{userTokens}</span>
            <span className="text-muted-foreground">tokens</span>
          </div>
          
          <Button size="sm" variant="outline" className="hidden md:inline-flex">
            Login
          </Button>
          
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
