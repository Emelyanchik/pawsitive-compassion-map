import React, { useState } from 'react';
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
  Calendar,
  BarChart,
  FileText,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Header from '@/components/Header';
import TokenActivity from '@/components/TokenActivity';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { InstagramIntegration } from '@/components/InstagramIntegration';
import { VolunteerShelterInfo } from '@/components/VolunteerShelterInfo';
import { AchievementSystem } from '@/components/AchievementSystem';
import { UserActivityAnalytics } from '@/components/UserActivityAnalytics';
import { InteractiveAnimalCard } from '@/components/InteractiveAnimalCard';

const ProfilePage = () => {
  const { userTokens, animals } = useMap();
  const [dataView, setDataView] = useState<'progress' | 'stats' | 'activity'>('progress');
  
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
    animalsSaved: 7,
    totalContributions: 24
  };

  // Статистика для системы достижений
  const userStats = {
    animalsHelped: userProfile.animalsHelped,
    daysActive: 15,
    postsShared: 8,
    volunteersConnected: 5
  };
  
  const reportedAnimals = animals.filter(animal => animal.reportedBy === userProfile.username);
  
  // Calculate progress to next level (example calculation)
  const currentLevelThreshold = userProfile.level * 100;
  const nextLevelThreshold = (userProfile.level + 1) * 100;
  const progress = ((userProfile.tokensEarned - currentLevelThreshold) / 
                   (nextLevelThreshold - currentLevelThreshold)) * 100;

  // Конвертируем животных для InteractiveAnimalCard
  const interactiveAnimals = reportedAnimals.map(animal => ({
    ...animal,
    urgency: 'medium' as const,
    helpProgress: Math.floor(Math.random() * 80) + 10,
    volunteersInvolved: Math.floor(Math.random() * 5) + 1,
    estimatedCost: Math.floor(Math.random() * 500) + 100
  }));

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
                <ToggleGroup 
                  type="single" 
                  value={dataView} 
                  onValueChange={(value) => value && setDataView(value as 'progress' | 'stats' | 'activity')}
                  className="justify-center mb-4"
                >
                  <ToggleGroupItem value="progress" aria-label="View progress">
                    <BarChart className="h-4 w-4 mr-2" />
                    Progress
                  </ToggleGroupItem>
                  <ToggleGroupItem value="stats" aria-label="View stats">
                    <FileText className="h-4 w-4 mr-2" />
                    Stats
                  </ToggleGroupItem>
                  <ToggleGroupItem value="activity" aria-label="View activity">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Activity
                  </ToggleGroupItem>
                </ToggleGroup>

                {dataView === 'progress' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Level Progress</p>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(progress)}% to Level {userProfile.level + 1}
                    </p>
                  </div>
                )}
                
                {dataView === 'stats' && (
                  <div>
                    <div className="text-center mb-2">
                      <div className="text-4xl font-bold">{userProfile.totalContributions}</div>
                      <p className="text-sm text-muted-foreground">Total Contributions</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xl font-bold">{userProfile.animalsHelped}</p>
                        <p className="text-xs text-muted-foreground">Helped</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xl font-bold">{userProfile.animalsSaved}</p>
                        <p className="text-xs text-muted-foreground">Saved</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {dataView === 'activity' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Last week</span>
                      <span className="font-medium">12 actions</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({length: 7}).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-6 flex-1 rounded-sm ${i % 3 === 0 ? 'bg-petmap-purple/70' : 'bg-petmap-purple/30'}`}
                          style={{ height: `${Math.max(20, Math.random() * 80)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
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
              <TabsList className="grid grid-cols-6 mb-4">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="animals">My Animals</TabsTrigger>
                <TabsTrigger value="achievements">Rewards</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
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
                                animal.status === 'adopted' ? 'default' : 'outline'
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
                    {interactiveAnimals.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interactiveAnimals.map((animal) => (
                          <InteractiveAnimalCard
                            key={animal.id}
                            animal={animal}
                            onHelp={(id) => console.log('Help animal:', id)}
                            onShare={(id) => console.log('Share animal:', id)}
                            onContact={(id) => console.log('Contact about animal:', id)}
                          />
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
              
              <TabsContent value="achievements" className="space-y-4">
                <AchievementSystem userStats={userStats} />
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <UserActivityAnalytics />
              </TabsContent>
              
              <TabsContent value="instagram" className="space-y-4">
                <InstagramIntegration animalData={
                  reportedAnimals.length > 0 ? {
                    name: reportedAnimals[0].name,
                    type: reportedAnimals[0].type,
                    location: reportedAnimals[0].location
                  } : undefined
                } />
              </TabsContent>
              
              <TabsContent value="community" className="space-y-4">
                <VolunteerShelterInfo />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
