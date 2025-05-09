
import React, { useState, useEffect } from 'react';
import { X, User, Settings, LogOut, Heart, MapPin, Bell, Moon, Sun, Activity, Shield, Globe, 
  Download, Calendar, Filter, Search, Clock, ArrowUpRight, Trash } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'preferences'>('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [activityPeriod, setActivityPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
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
    donations: 2,
    memberSince: "2023-05-15"
  };

  // Mock user activity data
  const allActivities = [
    { id: 1, type: 'animal_help', description: 'Helped a stray cat', date: '2 days ago' },
    { id: 2, type: 'donation', description: 'Donated $25 to local shelter', date: '1 week ago' },
    { id: 3, type: 'report', description: 'Reported an injured dog', date: '2 weeks ago' },
    { id: 4, type: 'volunteer', description: 'Signed up for volunteer work', date: '1 month ago' },
    { id: 5, type: 'animal_help', description: 'Rescued bird with broken wing', date: '3 days ago' },
    { id: 6, type: 'donation', description: 'Donated supplies to pet shelter', date: '2 weeks ago' },
  ];
  
  // Filter activities based on search term and period
  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = searchTerm === '' || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activityPeriod === 'week') {
      return activity.date.includes('day') || activity.date.includes('week');
    } else if (activityPeriod === 'month') {
      return !activity.date.includes('month') || 
        (activity.date.includes('month') && activity.date.includes('1 month'));
    }
    
    return true;
  });

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

  const exportUserData = () => {
    // Create a data object with user information and activities
    const dataToExport = {
      userProfile: {
        ...user,
        privacyLevel,
        emailNotifications,
        locationSharing,
        theme
      },
      activities: allActivities
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(dataToExport, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${user.name.replace(' ', '_')}_profile_data.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Data Exported",
      description: "Your profile data has been exported successfully.",
    });
  };
  
  const handleDeleteAccount = () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }
    
    toast({
      title: "Account Deleted",
      description: "Your account has been deleted. You will be redirected to the homepage.",
      variant: "destructive"
    });
    
    // In a real app, this would perform the actual account deletion
    // For demo purposes, we just close the panel after a short delay
    setTimeout(() => {
      onClose();
    }, 3000);
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
        <p className="text-xs text-gray-400 mt-1">Member since {user.memberSince}</p>
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
      
      <Tabs defaultValue="profile" onValueChange={(value) => setActiveTab(value as 'profile' | 'activity' | 'preferences')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Account Information</h3>
                <p className="text-sm text-gray-500">{user.name} • {user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={exportUserData} className="flex gap-1 items-center">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-base font-medium">Your Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-md p-3">
                  <div className="text-2xl font-semibold">{user.contributions}</div>
                  <div className="text-sm text-gray-500">Total Contributions</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-2xl font-semibold">{user.animals_helped + user.donations}</div>
                  <div className="text-sm text-gray-500">Total Impact</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-base font-medium">Account Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex gap-1 items-center">
                  <ArrowUpRight className="h-4 w-4" />
                  View Public Profile
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="flex gap-1 items-center">
                  <Trash className="h-4 w-4" />
                  {deleteConfirmation ? "Confirm Delete" : "Delete Account"}
                </Button>
              </div>
              {deleteConfirmation && (
                <p className="text-xs text-destructive mt-2">
                  Warning: This action cannot be undone. Click again to confirm.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4 pt-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search activities..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <ToggleGroup 
              type="single" 
              value={activityPeriod} 
              onValueChange={(value) => value && setActivityPeriod(value as 'all' | 'week' | 'month')}
              className="flex border rounded-md overflow-hidden"
            >
              <ToggleGroupItem value="all" size="sm" className="px-2 py-1 text-xs h-auto">All</ToggleGroupItem>
              <ToggleGroupItem value="week" size="sm" className="px-2 py-1 text-xs h-auto">Week</ToggleGroupItem>
              <ToggleGroupItem value="month" size="sm" className="px-2 py-1 text-xs h-auto">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {filteredActivities.length > 0 ? (
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {filteredActivities.map(activity => (
                  <div key={activity.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{activity.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
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
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">No activities found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preferences" className="pt-4">
          <ScrollArea className="h-[320px]">
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
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PetMap Demo App v1.0<br />
          Created with <Heart className="h-3 w-3 inline text-petmap-red" /> for animals
        </p>
      </div>
    </div>
  );
};
