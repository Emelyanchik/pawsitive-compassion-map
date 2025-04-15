import React, { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Users,
  Heart,
  Trophy,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMediaQuery } from '@/hooks/use-media-query';
import TokenActivity from '@/components/TokenActivity';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9B30FF'];

const Statistics = () => {
  const { animals, tokenHolders } = useMap();
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('bar');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const animalStatusData = [
    { name: 'Needs Help', value: animals.filter(a => a.status === 'needs_help').length, color: '#FF8042' },
    { name: 'Being Helped', value: animals.filter(a => a.status === 'being_helped').length, color: '#FFBB28' },
    { name: 'Adopted', value: animals.filter(a => a.status === 'adopted').length, color: '#00C49F' },
    { name: 'Reported', value: animals.filter(a => a.status === 'reported').length, color: '#0088FE' }
  ];

  const animalTypeData = [
    { name: 'Cats', value: animals.filter(a => a.type === 'cat').length, color: '#9B30FF' },
    { name: 'Dogs', value: animals.filter(a => a.type === 'dog').length, color: '#FF8042' },
    { name: 'Other', value: animals.filter(a => a.type === 'other').length, color: '#00C49F' }
  ];

  const generateTimeData = () => {
    const data = [];
    const daysToInclude = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = daysToInclude - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      
      data.push({
        date: dateStr,
        cats: Math.max(0, Math.round(animals.filter(a => a.type === 'cat').length / daysToInclude * (1 + Math.random() * 0.5))),
        dogs: Math.max(0, Math.round(animals.filter(a => a.type === 'dog').length / daysToInclude * (1 + Math.random() * 0.5))),
        other: Math.max(0, Math.round(animals.filter(a => a.type === 'other').length / daysToInclude * (1 + Math.random() * 0.5))),
      });
    }
    
    return data;
  };

  const timeData = generateTimeData();

  const generateRescueTimeData = () => {
    const data = [];
    const daysToInclude = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = daysToInclude - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      
      data.push({
        date: dateStr,
        rescued: Math.max(0, Math.round(animals.filter(a => a.status === 'being_helped' || a.status === 'adopted').length / daysToInclude * (1 + Math.random() * 0.5))),
        reported: Math.max(0, Math.round(animals.filter(a => a.status === 'needs_help' || a.status === 'reported').length / daysToInclude * (1 + Math.random() * 0.5))),
      });
    }
    
    return data;
  };

  const rescueTimeData = generateRescueTimeData();

  const calculateTotals = () => {
    const totalRescued = animals.filter(a => a.status === 'being_helped' || a.status === 'adopted').length;
    const totalReported = animals.length;
    const activeVolunteers = new Set(animals.filter(a => a.guardian).map(a => a.guardian)).size;
    const totalTokens = tokenHolders.reduce((sum, holder) => sum + holder.tokens, 0);

    return {
      totalRescued,
      totalReported,
      activeVolunteers,
      totalTokens
    };
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">PetMap Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-petmap-orange" />
              <span>Animals Rescued</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.totalRescued}</div>
            <p className="text-sm text-muted-foreground">
              Out of {totals.totalReported} reported
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-petmap-blue" />
              <span>Active Volunteers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.activeVolunteers}</div>
            <p className="text-sm text-muted-foreground">
              Helping animals in need
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-petmap-green" />
              <span>Total Tokens</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.totalTokens}</div>
            <p className="text-sm text-muted-foreground">
              Earned by all users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-petmap-purple" />
              <span>Success Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals.totalReported ? Math.round((totals.totalRescued / totals.totalReported) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Rescue success rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setChartType('bar')} 
            className={chartType === 'bar' ? 'bg-primary/10 text-primary' : ''}>
            <BarChart className="h-4 w-4 mr-1" />
            Bar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setChartType('pie')}
            className={chartType === 'pie' ? 'bg-primary/10 text-primary' : ''}>
            <PieChartIcon className="h-4 w-4 mr-1" />
            Pie
          </Button>
          <Button variant="outline" size="sm" onClick={() => setChartType('line')}
            className={chartType === 'line' ? 'bg-primary/10 text-primary' : ''}>
            <LineChartIcon className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="status" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="status">By Status</TabsTrigger>
          <TabsTrigger value="type">By Type</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tokens">Top Contributors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Animals by Status</CardTitle>
              <CardDescription>
                Distribution of animals by their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={animalStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8">
                        {animalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={animalStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {animalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rescueTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rescued" stroke="#00C49F" />
                      <Line type="monotone" dataKey="reported" stroke="#FF8042" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="type">
          <Card>
            <CardHeader>
              <CardTitle>Animals by Type</CardTitle>
              <CardDescription>
                Distribution of animals by their species
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={animalTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8">
                        {animalTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={animalTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {animalTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cats" stroke="#9B30FF" />
                      <Line type="monotone" dataKey="dogs" stroke="#FF8042" />
                      <Line type="monotone" dataKey="other" stroke="#00C49F" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Rescue Timeline</CardTitle>
              <CardDescription>
                Animals reported and rescued over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rescueTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reported" stroke="#FF8042" strokeWidth={2} />
                    <Line type="monotone" dataKey="rescued" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>
                Users with the highest token earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    {!isMobile && <TableHead>Username</TableHead>}
                    <TableHead className="text-right">Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenHolders
                    .sort((a, b) => b.tokens - a.tokens)
                    .map((holder, index) => (
                      <TableRow key={holder.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{holder.name}</TableCell>
                        {!isMobile && <TableCell>@{holder.username}</TableCell>}
                        <TableCell className="text-right">
                          {holder.tokens.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Your Token Activity</h2>
        <TokenActivity />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Community Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Most Recent Rescue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                {animals.filter(a => a.status === 'being_helped' || a.status === 'adopted').length > 0 
                  ? 'Max the Golden Retriever' 
                  : 'No rescues yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                Rescued 2 days ago
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fastest Rescue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Whiskers</p>
              <p className="text-sm text-muted-foreground">
                Rescued in just 35 minutes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Rescue Area</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Downtown</p>
              <p className="text-sm text-muted-foreground">
                12 animals rescued this month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
