
import React from 'react';
import { Button } from './ui/button';
import { Coins, User } from 'lucide-react';
import { Badge } from './ui/badge';
import Navigation from './Navigation';
import { useMap } from '@/contexts/MapContext';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-petmap-purple text-white text-sm">
                    JS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Coins className="mr-2 h-4 w-4" />
                <span>{userTokens} tokens</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
