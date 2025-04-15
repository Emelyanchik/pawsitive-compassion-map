
import React from 'react';
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
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMap } from '@/contexts/MapContext';
import { cn } from '@/lib/utils';

const TokenActivity = () => {
  const { tokenHolders } = useMap();
  
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

  // Calculate stats
  const totalEarned = tokenHistory
    .filter(record => record.amount > 0)
    .reduce((sum, record) => sum + record.amount, 0);
    
  const totalSpent = tokenHistory
    .filter(record => record.amount < 0)
    .reduce((sum, record) => sum + Math.abs(record.amount), 0);

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
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="spent">Spent</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-[150px] pl-8 h-9"
              />
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
                {tokenHistory.map((record, index) => (
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
                {tokenHistory
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
                {tokenHistory
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
