
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Activity, Thermometer, Weight, Calendar, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { useMap } from '@/contexts/MapContext';

interface HealthRecord {
  id: string;
  date: string;
  type: 'checkup' | 'vaccination' | 'treatment' | 'emergency';
  description: string;
  vetName?: string;
  notes?: string;
  nextAppointment?: string;
}

interface VitalSigns {
  temperature: number;
  weight: number;
  heartRate: number;
  lastUpdated: string;
}

const AnimalHealthTracker: React.FC = () => {
  const { selectedAnimal } = useMap();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock health data - in a real app, this would come from a database
  const [healthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'checkup',
      description: 'Annual health checkup',
      vetName: 'Dr. Smith',
      notes: 'Overall health good, recommended dental cleaning',
      nextAppointment: '2024-07-15'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'vaccination',
      description: 'Rabies vaccination',
      vetName: 'Dr. Johnson',
      notes: 'No adverse reactions'
    }
  ]);

  const [vitalSigns] = useState<VitalSigns>({
    temperature: 38.5,
    weight: 12.3,
    heartRate: 120,
    lastUpdated: '2024-01-16'
  });

  const getHealthScore = () => {
    // Calculate health score based on various factors
    let score = 85;
    if (vitalSigns.temperature > 39.5 || vitalSigns.temperature < 37.5) score -= 10;
    if (healthRecords.length < 2) score -= 5;
    return Math.max(0, Math.min(100, score));
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Heart className="h-4 w-4 text-green-500" />;
      case 'vaccination': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'treatment': return <Thermometer className="h-4 w-4 text-orange-500" />;
      case 'emergency': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getRecordTypeBadge = (type: string) => {
    const variants = {
      checkup: 'default',
      vaccination: 'secondary',
      treatment: 'outline',
      emergency: 'destructive'
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  if (!selectedAnimal) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Select an animal to view health information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health Tracker - {selectedAnimal.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{getHealthScore()}%</div>
                      <Progress value={getHealthScore()} className="h-2" />
                      <p className="text-xs text-gray-600">Last updated: {vitalSigns.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Next Checkup</span>
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold">July 15, 2024</div>
                      <p className="text-xs text-gray-600">Dr. Smith - Annual checkup</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        {getRecordTypeIcon(record.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{record.description}</span>
                            <Badge variant={getRecordTypeBadge(record.type)} className="text-xs">
                              {record.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{record.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="records" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Medical Records</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Record
                </Button>
              </div>
              
              <div className="space-y-3">
                {healthRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getRecordTypeIcon(record.type)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{record.description}</h4>
                            <Badge variant={getRecordTypeBadge(record.type)} className="text-xs">
                              {record.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Date: {record.date}</p>
                            {record.vetName && <p>Veterinarian: {record.vetName}</p>}
                            {record.notes && <p>Notes: {record.notes}</p>}
                            {record.nextAppointment && (
                              <p>Next appointment: {record.nextAppointment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{vitalSigns.temperature}°C</div>
                      <div className="text-xs text-gray-600">
                        Normal range: 37.5°C - 39.2°C
                      </div>
                      {(vitalSigns.temperature > 39.2 || vitalSigns.temperature < 37.5) && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Outside normal range
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Weight className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Weight</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{vitalSigns.weight} kg</div>
                      <div className="text-xs text-gray-600">
                        Last weighed: {vitalSigns.lastUpdated}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{vitalSigns.heartRate} bpm</div>
                      <div className="text-xs text-gray-600">
                        Normal range: 60-140 bpm
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalHealthTracker;
