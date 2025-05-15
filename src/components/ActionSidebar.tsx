import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import MapInfoPanel from '@/components/MapInfoPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Cat, 
  Dog, 
  Filter, 
  AlertTriangle, 
  Users, 
  Award, 
  Layers, 
  Settings, 
  HelpCircle,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ActionSidebar = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [weatherExpanded, setWeatherExpanded] = useState(false);
  const { 
    filter, 
    setFilter, 
    distanceFilter, 
    setDistanceFilter, 
    statusFilter, 
    setStatusFilter,
    userTokens,
    addTokens,
    convertTokens
  } = useMap();
  const { toast } = useToast();
  
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Animal Reported",
      description: "Thank you for your report. Our volunteers will check it soon.",
    });
    addTokens(20, "Reporting animal");
    setActiveTab('filter');
  };
  
  const handleConvertTokens = (amount: number, reward: string) => {
    const success = convertTokens(amount, reward);
    if (success) {
      toast({
        title: "Tokens Converted",
        description: `You have successfully redeemed ${amount} tokens for ${reward}.`,
      });
    } else {
      toast({
        title: "Conversion Failed",
        description: "You don't have enough tokens for this reward.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Sheet modal={false} open={true}>
      <SheetContent className="w-full sm:max-w-md border-l p-0">
        <div className="h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle>PetMap Tools</SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-grow">
            <div className="flex flex-col p-4 gap-6">
              <MapInfoPanel />
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="report" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Report</span>
                  </TabsTrigger>
                  <TabsTrigger value="filter" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </TabsTrigger>
                  <TabsTrigger value="volunteer" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Volunteer</span>
                  </TabsTrigger>
                  <TabsTrigger value="rewards" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Rewards</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="report" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report an Animal</h3>
                    <p className="text-sm text-muted-foreground">
                      Report an animal that needs help. You'll earn 20 tokens for each verified report.
                    </p>
                    
                    <form onSubmit={handleReportSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="animal-type">Animal Type</Label>
                        <RadioGroup defaultValue="cat" id="animal-type" className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cat" id="cat" />
                            <Label htmlFor="cat" className="flex items-center gap-1">
                              <Cat className="h-4 w-4" /> Cat
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dog" id="dog" />
                            <Label htmlFor="dog" className="flex items-center gap-1">
                              <Dog className="h-4 w-4" /> Dog
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="animal-status">Status</Label>
                        <Select defaultValue="needs_help">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="needs_help">Needs Help</SelectItem>
                            <SelectItem value="injured">Injured</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="stray">Stray</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe the animal and its condition..." 
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="photo">Photo (optional)</Label>
                        <Input id="photo" type="file" accept="image/*" />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="use-current-location" defaultChecked />
                        <Label htmlFor="use-current-location">Use my current location</Label>
                      </div>
                      
                      <Button type="submit" className="w-full">Submit Report</Button>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="filter" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Filter Animals</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Animal Type</Label>
                        <div className="flex gap-2">
                          <Button 
                            variant={filter === 'all' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setFilter('all')}
                            className="flex-1"
                          >
                            All
                          </Button>
                          <Button 
                            variant={filter === 'cats' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setFilter('cats')}
                            className="flex-1 flex items-center justify-center gap-1"
                          >
                            <Cat className="h-4 w-4" /> Cats
                          </Button>
                          <Button 
                            variant={filter === 'dogs' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setFilter('dogs')}
                            className="flex-1 flex items-center justify-center gap-1"
                          >
                            <Dog className="h-4 w-4" /> Dogs
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Distance (km): {distanceFilter}</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => setDistanceFilter(0)}
                          >
                            Reset
                          </Button>
                        </div>
                        <Slider
                          value={[distanceFilter]}
                          min={0}
                          max={50}
                          step={1}
                          onValueChange={(value) => setDistanceFilter(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 km</span>
                          <span>25 km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={statusFilter === 'needs_help' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setStatusFilter(statusFilter === 'needs_help' ? null : 'needs_help')}
                            className="flex items-center justify-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Needs Help
                          </Button>
                          <Button 
                            variant={statusFilter === 'being_helped' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setStatusFilter(statusFilter === 'being_helped' ? null : 'being_helped')}
                            className="flex items-center justify-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Being Helped
                          </Button>
                          <Button 
                            variant={statusFilter === 'adopted' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setStatusFilter(statusFilter === 'adopted' ? null : 'adopted')}
                            className="flex items-center justify-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Adopted
                          </Button>
                          <Button 
                            variant={statusFilter === 'reported' ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setStatusFilter(statusFilter === 'reported' ? null : 'reported')}
                            className="flex items-center justify-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Reported
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Map Layers</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4" />
                              <span className="text-sm">Show Area Labels</span>
                            </div>
                            <Switch id="show-areas" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4" />
                              <span className="text-sm">Show Heatmap</span>
                            </div>
                            <Switch id="show-heatmap" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="volunteer" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Volunteer Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      Help animals in need and earn tokens for your contributions.
                    </p>
                    
                    <div className="space-y-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Transport Volunteer</CardTitle>
                          <CardDescription>Help transport animals to shelters or vet clinics</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge className="bg-blue-500">50 tokens per trip</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" className="w-full">Sign Up</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Shelter Helper</CardTitle>
                          <CardDescription>Assist at local animal shelters with daily tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge className="bg-green-500">100 tokens per day</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" className="w-full">Sign Up</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Foster Parent</CardTitle>
                          <CardDescription>Temporarily house animals until they find forever homes</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge className="bg-purple-500">200 tokens per week</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" className="w-full">Sign Up</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="rewards" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Your Rewards</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>{userTokens} tokens</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Token Progress</Label>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Current: {userTokens}</span>
                          <span>Next Reward: 500</span>
                        </div>
                        <Progress value={(userTokens / 500) * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Pet Store Discount</CardTitle>
                          <CardDescription>10% off at participating pet stores</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge variant="outline">100 tokens</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleConvertTokens(100, "Pet Store Discount")}
                            disabled={userTokens < 100}
                          >
                            Redeem
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Vet Clinic Voucher</CardTitle>
                          <CardDescription>$25 voucher for veterinary services</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge variant="outline">250 tokens</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleConvertTokens(250, "Vet Clinic Voucher")}
                            disabled={userTokens < 250}
                          >
                            Redeem
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Premium Membership</CardTitle>
                          <CardDescription>1 month of premium features and priority support</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Badge variant="outline">500 tokens</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleConvertTokens(500, "Premium Membership")}
                            disabled={userTokens < 500}
                          >
                            Redeem
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CloudRain className="h-5 w-5" />
                    Weather Information
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setWeatherExpanded(!weatherExpanded)}
                  >
                    {weatherExpanded ? 'Show Less' : 'Show More'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <Thermometer className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="text-2xl font-bold">22°C</span>
                    <span className="text-xs text-muted-foreground">Feels like 24°C</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <CloudRain className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-sm font-medium">Precipitation</span>
                    <span className="text-2xl font-bold">10%</span>
                    <span className="text-xs text-muted-foreground">0.0 mm expected</span>
                  </div>
                </div>
                
                {weatherExpanded && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <Wind className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-sm font-medium">Wind</span>
                        <span className="text-xl font-bold">8 km/h</span>
                        <span className="text-xs text-muted-foreground">NE direction</span>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-sm font-medium">Humidity</span>
                        <span className="text-xl font-bold">65%</span>
                        <span className="text-xs text-muted-foreground">Moderate</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <Sunrise className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-sm font-medium">Sunrise</span>
                        <span className="text-lg font-bold">06:42 AM</span>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <Sunset className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-sm font-medium">Sunset</span>
                        <span className="text-lg font-bold">08:15 PM</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Forecast</h4>
                      <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                          <span className="text-xs">Now</span>
                          <Sun className="h-5 w-5 text-amber-500 my-1" />
                          <span className="text-xs font-medium">22°C</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">2PM</span>
                          <Sun className="h-5 w-5 text-amber-500 my-1" />
                          <span className="text-xs font-medium">24°C</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">4PM</span>
                          <CloudRain className="h-5 w-5 text-blue-500 my-1" />
                          <span className="text-xs font-medium">23°C</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">6PM</span>
                          <CloudRain className="h-5 w-5 text-blue-500 my-1" />
                          <span className="text-xs font-medium">21°C</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">8PM</span>
                          <CloudRain className="h-5 w-5 text-blue-500 my-1" />
                          <span className="text-xs font-medium">19°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Weather data is updated every 30 minutes. Last updated: 1:30 PM
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support
                </h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How to Use PetMap
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionSidebar;
