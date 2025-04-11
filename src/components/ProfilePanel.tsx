
import React, { useState } from 'react';
import { X, User, Settings, LogOut, Heart, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProfilePanelProps {
  onClose: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  
  // Mock user data
  const user = {
    name: "Animal Helper",
    email: "helper@example.com",
    contributions: 5,
    animals_helped: 3,
    donations: 2
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your profile settings have been updated.",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };
  
  return (
    <div className="relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 mb-6 pr-8">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-bold">Profile</h2>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src="" alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-medium">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <div className="font-bold text-xl">{user.contributions}</div>
          <div className="text-xs text-gray-500">Contributions</div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <div className="font-bold text-xl">{user.animals_helped}</div>
          <div className="text-xs text-gray-500">Animals Helped</div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <div className="font-bold text-xl">{user.donations}</div>
          <div className="text-xs text-gray-500">Donations</div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-6">
        <h3 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">
                <Bell className="h-4 w-4 inline mr-2" />
                Email Notifications
              </Label>
              <p className="text-xs text-gray-500">
                Receive updates about animals in your area
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-sharing" className="text-base">
                <MapPin className="h-4 w-4 inline mr-2" />
                Location Sharing
              </Label>
              <p className="text-xs text-gray-500">
                Allow app to use your location for nearby animals
              </p>
            </div>
            <Switch
              id="location-sharing"
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
            />
          </div>
        </div>
        
        <div className="pt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          PetMap Demo App v1.0<br />
          Created with <Heart className="h-3 w-3 inline text-petmap-red" /> for animals
        </p>
      </div>
    </div>
  );
};
