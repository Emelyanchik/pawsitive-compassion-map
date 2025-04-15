
import React from 'react';
import { useMap } from '@/contexts/MapContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Heart, 
  Award, 
  Bell, 
  Settings, 
  Clock, 
  Shield, 
  Coins,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Header from '@/components/Header';

const ProfilePage = () => {
  const { userTokens, animals } = useMap();
  
  // Example user data - in a real app, this would come from the backend
  const userProfile = {
    name: 'Jane Smith',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    joined: new Date(2023, 2, 15),
    bio: 'Animal lover and volunteer. I help stray animals find their forever homes.',
    location: 'San Francisco, CA',
    avatarUrl: '',
    tokensEarned: userTokens || 250,
    level: 3,
    animalsHelped: 12,
    animalsSaved: 7
  };
  
  const reportedAnimals = animals.filter(animal => animal.reportedBy === userProfile.username);
  
  // Calculate progress to next level (example calculation)
  const currentLevelThreshold = userProfile.level * 100;
  const nextLevelThreshold = (userProfile.level + 1) * 100;
  const progress = ((userProfile.tokensEarned - currentLevelThreshold) / 
                   (nextLevelThreshold - currentLevelThreshold)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto pt-16 px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                <AvatarFallback className="text-xl bg-petmap-purple text-white">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{userProfile.name}</CardTitle>
              <CardDescription>@{userProfile.username}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-petmap-purple/10 text-petmap-purple">
                  Level {userProfile.level}
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  <Coins className="w-3 h-3 mr-1" />
                  {userProfile.tokensEarned} tokens
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Level Progress</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(progress)}% to Level {userProfile.level + 1}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{userProfile.animalsHelped}</p>
                    <p className="text-sm text-muted-foreground">Animals Helped</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userProfile.animalsSaved}</p>
                    <p className="text-sm text-muted-foreground">Animals Saved</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {format(userProfile.joined, 'MMMM yyyy')}</span>
                  </div>
                </div>
                
                <p className="text-sm">{userProfile.bio}</p>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="activity">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="animals">My Animals</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reportedAnimals.length > 0 ? (
                      <div className="space-y-4">
                        {reportedAnimals.map((animal) => (
                          <div key={animal.id} className="flex items-start gap-4 p-3 rounded-lg border">
                            <div className="bg-blue-100 p-3 rounded-full">
                              {animal.type === 'cat' ? (
                                <Avatar>
                                  <AvatarFallback>🐱</AvatarFallback>
                                </Avatar>
                              ) : (
                                <Avatar>
                                  <AvatarFallback>🐶</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">{animal.name}</p>
                              <p className="text-sm text-muted-foreground">{format(new Date(animal.reportedAt), 'MMM d, yyyy')}</p>
                              <Badge variant={
                                animal.status === 'needs_help' ? 'destructive' :
                                animal.status === 'being_helped' ? 'default' :
                                animal.status === 'adopted' ? 'success' : 'outline'
                              }>
                                {animal.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">No Activity Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Your activity will appear here once you start helping animals
                        </p>
                        <Button>Report an Animal</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="animals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">My Reported Animals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reportedAnimals.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reportedAnimals.map((animal) => (
                          <Card key={animal.id} className="overflow-hidden">
                            <div className="h-32 bg-gray-200 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {animal.type === 'cat' ? '🐱' : '🐶'}
                              </div>
                              <Badge 
                                className="absolute top-2 right-2"
                                variant={
                                  animal.status === 'needs_help' ? 'destructive' :
                                  animal.status === 'being_helped' ? 'default' :
                                  animal.status === 'adopted' ? 'success' : 'outline'
                                }
                              >
                                {animal.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <CardContent className="pt-4">
                              <h3 className="font-medium">{animal.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Reported on {format(new Date(animal.reportedAt), 'MMM d, yyyy')}
                              </p>
                              <p className="text-sm line-clamp-2">{animal.description}</p>
                              <div className="flex justify-between items-center mt-3">
                                <Badge variant="outline">
                                  {animal.type}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">No Animals Reported</h3>
                        <p className="text-muted-foreground mb-4">
                          Animals you report will appear here
                        </p>
                        <Button>Report an Animal</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="badges" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Achievement Badges</CardTitle>
                    <CardDescription>
                      Earn badges by reaching milestones and helping animals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-4 border rounded-lg">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <Award className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-medium text-center">First Rescue</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">Report your first animal</p>
                      </div>
                      
                      <div className="flex flex-col items-center p-4 border rounded-lg">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <Heart className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-center">Helping Hand</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">Help 5 animals in need</p>
                      </div>
                      
                      <div className="flex flex-col items-center p-4 border rounded-lg opacity-50">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Shield className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-center">Guardian</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">Help 25 animals</p>
                      </div>
                      
                      <div className="flex flex-col items-center p-4 border rounded-lg opacity-50">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Coins className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-center">Token Master</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">Earn 500 tokens</p>
                      </div>
                      
                      <div className="flex flex-col items-center p-4 border rounded-lg opacity-50">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-center">First Adopter</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">Help an animal get adopted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      This section will allow you to update your profile information and preferences.
                    </p>
                    <Button variant="outline">Coming Soon</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
