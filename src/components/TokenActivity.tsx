import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  Filter, 
  Search,
  Download,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TokenActivity = () => {
  const { tokenHolders } = useMap();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
  
  // Find the current user from token holders
  const currentUser = tokenHolders.find(holder => holder.username === 'current_user');
  
  if (!currentUser) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Token Activity</CardTitle>
          <CardDescription>Your token earning history</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-36">
          <p className="text-muted-foreground">No token activity found</p>
        </CardContent>
      </Card>
    );
  }

  // Get token history and sort by date (newest first)
  const tokenHistory = [...currentUser.tokensHistory].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Filter token history based on search term and date range
  const filteredHistory = tokenHistory.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateRange === 'all') return matchesSearch;
    
    const recordDate = new Date(record.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dateRange === '7days' && daysDiff <= 7) return matchesSearch;
    if (dateRange === '30days' && daysDiff <= 30) return matchesSearch;
    if (dateRange === '90days' && daysDiff <= 90) return matchesSearch;
    
    return false;
  });

  // Calculate stats
  const totalEarned = tokenHistory
    .filter(record => record.amount > 0)
    .reduce((sum, record) => sum + record.amount, 0);
    
  const totalSpent = tokenHistory
    .filter(record => record.amount < 0)
    .reduce((sum, record) => sum + Math.abs(record.amount), 0);

  // Export token history to CSV
  const exportToCSV = (records: typeof tokenHistory) => {
    // Create CSV headers
    const headers = ['Date', 'Reason', 'Amount'];
    
    // Create CSV rows
    const csvContent = records.map(record => {
      return [
        format(parseISO(record.date), 'yyyy-MM-dd'),
        record.reason,
        record.amount
      ].join(',');
    });
    
    // Combine headers and rows
    const csv = [headers.join(','), ...csvContent].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `token-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Token activity exported to CSV file",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Token Activity
        </CardTitle>
        <CardDescription>Your token earning history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="spent">Spent</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="w-[150px] pl-8 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="end">
                  <Select 
                    value={dateRange} 
                    onValueChange={(value: any) => setDateRange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => exportToCSV(filteredHistory)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Current Balance</div>
                <div className="text-2xl font-bold">{currentUser.tokens}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Earned</div>
                <div className="text-2xl font-bold text-petmap-green">{totalEarned}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold text-petmap-orange">{totalSpent}</div>
              </CardContent>
            </Card>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {filteredHistory.map((record, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "rounded-full p-2", 
                        record.amount > 0 ? "bg-green-100" : "bg-orange-100"
                      )}>
                        {record.amount > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{record.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(record.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "font-semibold",
                      record.amount > 0 ? "text-green-600" : "text-orange-600"
                    )}>
                      {record.amount > 0 ? '+' : ''}{record.amount}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="earned" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {filteredHistory
                  .filter(record => record.amount > 0)
                  .map((record, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-2 bg-green-100">
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{record.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(record.date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold text-green-600">
                        +{record.amount}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="spent" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {filteredHistory
                  .filter(record => record.amount < 0)
                  .map((record, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-2 bg-orange-100">
                          <ArrowDownRight className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{record.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(record.date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold text-orange-600">
                        {record.amount}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TokenActivity;
