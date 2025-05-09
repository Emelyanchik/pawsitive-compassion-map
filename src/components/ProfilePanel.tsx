
import React, { useState, useEffect } from 'react';
import { X, User, Settings, LogOut, Heart, MapPin, Bell, Moon, Sun, Activity, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ProfilePanelProps {
  onClose: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState("balanced");
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  
  // Effect for theme initialization
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock user data
  const user = {
    name: "Animal Helper",
    email: "helper@example.com",
    contributions: 5,
    animals_helped: 3,
    donations: 2
  };

  // Mock user activity data
  const recentActivity = [
    { id: 1, type: 'animal_help', description: 'Helped a stray cat', date: '2 days ago' },
    { id: 2, type: 'donation', description: 'Donated $25 to local shelter', date: '1 week ago' },
    { id: 3, type: 'report', description: 'Reported an injured dog', date: '2 weeks ago' },
    { id: 4, type: 'volunteer', description: 'Signed up for volunteer work', date: '1 month ago' },
  ];
  
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast({
      title: "Theme Changed",
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode.`,
    });
  };
  
  // Avoid rendering theme-dependent UI elements before mount
  if (!mounted) {
    return null;
  }
  
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
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
          <div className="font-bold text-xl">{user.contributions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Contributions</div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
          <div className="font-bold text-xl">{user.animals_helped}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Animals Helped</div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
          <div className="font-bold text-xl">{user.donations}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Donations</div>
        </div>
      </div>
      
      <div className="flex space-x-1 mb-6">
        <Button 
          variant={activeTab === 'profile' ? "default" : "outline"} 
          size="sm" 
          className="flex-1"
          onClick={() => setActiveTab('profile')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button 
          variant={activeTab === 'activity' ? "default" : "outline"} 
          size="sm" 
          className="flex-1"
          onClick={() => setActiveTab('activity')}
        >
          <Activity className="h-4 w-4 mr-2" />
          Activity
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <ScrollArea className="h-[350px]">
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    <Bell className="h-4 w-4 inline mr-2" />
                    Email Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Allow app to use your location for nearby animals
                  </p>
                </div>
                <Switch
                  id="location-sharing"
                  checked={locationSharing}
                  onCheckedChange={setLocationSharing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle" className="text-base">
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4 inline mr-2" />
                    ) : (
                      <Sun className="h-4 w-4 inline mr-2" />
                    )}
                    {theme === 'dark' ? 'Dark' : 'Light'} Mode
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-base">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Privacy Level
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Control how much of your information is visible to others
                </p>
                
                <RadioGroup defaultValue="balanced" value={privacyLevel} onValueChange={setPrivacyLevel}>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="font-medium">Private</Label>
                    <p className="text-xs text-gray-500 ml-auto">Hide all personal information</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="font-medium">Balanced</Label>
                    <p className="text-xs text-gray-500 ml-auto">Show basic information only</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-medium">Public</Label>
                    <p className="text-xs text-gray-500 ml-auto">Share all activity publicly</p>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-base">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Language
                </Label>
                <RadioGroup defaultValue="en">
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en">English</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="es" id="es" />
                    <Label htmlFor="es">Español</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="fr" id="fr" />
                    <Label htmlFor="fr">Français</Label>
                  </div>
                </RadioGroup>
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
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Recent Activity</h3>
            
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                    <Badge 
                      variant={
                        activity.type === 'animal_help' ? 'default' : 
                        activity.type === 'donation' ? 'secondary' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="link" size="sm">
                View all activity
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PetMap Demo App v1.0<br />
          Created with <Heart className="h-3 w-3 inline text-petmap-red" /> for animals
        </p>
      </div>
    </div>
  );
};
