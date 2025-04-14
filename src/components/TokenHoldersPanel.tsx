
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { X, Award, BadgePercent, Star, ArrowUpRight } from 'lucide-react';

interface TokenHoldersPanelProps {
  onClose: () => void;
}

// Sample data - in a real app, this would come from an API
const topHolders = [
  { 
    id: 1, 
    name: 'Alice Chen', 
    username: 'alice_petlover', 
    tokens: 1245, 
    rank: 1, 
    badges: ['Gold Volunteer', 'Top Donor'], 
    animalsHelped: 15,
    avatarUrl: '' 
  },
  { 
    id: 2, 
    name: 'Bob Smith', 
    username: 'bob_rescuer', 
    tokens: 980, 
    rank: 2, 
    badges: ['Silver Volunteer'], 
    animalsHelped: 12,
    avatarUrl: '' 
  },
  { 
    id: 3, 
    name: 'Carol Johnson', 
    username: 'carol_j', 
    tokens: 870, 
    rank: 3, 
    badges: ['Bronze Volunteer'], 
    animalsHelped: 9,
    avatarUrl: '' 
  },
  { 
    id: 4, 
    name: 'David Lee', 
    username: 'dave_lee', 
    tokens: 720, 
    rank: 4, 
    badges: [], 
    animalsHelped: 7,
    avatarUrl: '' 
  },
  { 
    id: 5, 
    name: 'Emma Wilson', 
    username: 'emma_w', 
    tokens: 650, 
    rank: 5, 
    badges: ['New Volunteer'], 
    animalsHelped: 5,
    avatarUrl: '' 
  },
];

export const TokenHoldersPanel = ({ onClose }: TokenHoldersPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <BadgePercent className="mr-2 h-6 w-6 text-orange-500" />
          Top Token Holders
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <span className="sr-only">Close</span>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Top 3 Token Holders */}
      <div className="grid grid-cols-3 gap-4">
        {topHolders.slice(0, 3).map((holder, index) => (
          <div 
            key={holder.id}
            className="relative bg-white rounded-lg border p-4 flex flex-col items-center text-center"
          >
            <div className="absolute -top-3 -right-3">
              <Badge className={
                index === 0 ? "bg-yellow-500" : 
                index === 1 ? "bg-gray-400" : 
                "bg-amber-700"
              }>
                <Award className="mr-1 h-3 w-3" />
                Rank #{holder.rank}
              </Badge>
            </div>
            
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={holder.avatarUrl} alt={holder.name} />
              <AvatarFallback className={
                index === 0 ? "bg-yellow-100 text-yellow-800" : 
                index === 1 ? "bg-gray-100 text-gray-800" : 
                "bg-amber-100 text-amber-800"
              }>
                {holder.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="font-medium text-sm">{holder.name}</h3>
            <p className="text-xs text-gray-500 mb-2">@{holder.username}</p>
            
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
              {holder.tokens} tokens
            </div>
            
            <p className="text-xs mt-2 text-gray-600">
              Helped {holder.animalsHelped} animals
            </p>
          </div>
        ))}
      </div>
      
      {/* Token Holders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Volunteer</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topHolders.map((holder) => (
              <TableRow key={holder.id}>
                <TableCell className="font-medium">#{holder.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={holder.avatarUrl} alt={holder.name} />
                      <AvatarFallback className="bg-gray-100">
                        {holder.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{holder.name}</div>
                      <div className="text-xs text-gray-500">@{holder.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{holder.tokens}</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {holder.badges.map((badge, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-0">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Progress 
                      value={holder.tokens / 12.45} 
                      className="h-2 w-24" 
                    />
                    <span className="text-xs text-gray-500">
                      Level {Math.floor(holder.tokens / 200) + 1}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">How to earn more tokens:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start">
            <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
            Volunteer your time to help animals in need
          </li>
          <li className="flex items-start">
            <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
            Donate to animal welfare organizations
          </li>
          <li className="flex items-start">
            <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
            Participate in rescue missions and community events
          </li>
          <li className="flex items-start">
            <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
            Refer friends to join the platform
          </li>
        </ul>
        
        <Button className="w-full mt-4" variant="outline">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View Complete Leaderboard
        </Button>
      </div>
    </div>
  );
};
