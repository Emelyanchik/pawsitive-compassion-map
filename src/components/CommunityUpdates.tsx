
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageCircle, Heart, Share2, MapPin, Clock, Users, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityUpdate {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: 'volunteer' | 'veterinarian' | 'shelter' | 'citizen';
  };
  type: 'rescue' | 'adoption' | 'update' | 'alert' | 'success';
  title: string;
  content: string;
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  hasImage?: boolean;
  animalName?: string;
  isLiked?: boolean;
}

const CommunityUpdates: React.FC = () => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<CommunityUpdate[]>([
    {
      id: '1',
      author: {
        name: 'Dr. Sarah Johnson',
        avatar: '/placeholder-avatar.jpg',
        role: 'veterinarian'
      },
      type: 'success',
      title: 'Max has found his forever home! 🏠',
      content: 'Great news! Max, the golden retriever we rescued last month, has been adopted by a loving family. He\'s doing great and loves his new backyard!',
      location: 'Downtown Animal Clinic',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      hasImage: true,
      animalName: 'Max',
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Maria Rodriguez',
        role: 'volunteer'
      },
      type: 'rescue',
      title: 'Injured cat needs immediate help',
      content: 'Found an injured cat near Central Park. She appears to have a hurt paw and is very scared. Can someone help with transportation to the nearest vet?',
      location: 'Central Park Area',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 15,
      hasImage: true,
      isLiked: true
    },
    {
      id: '3',
      author: {
        name: 'Happy Tails Shelter',
        role: 'shelter'
      },
      type: 'adoption',
      title: 'Adoption event this weekend!',
      content: 'Join us this Saturday for our monthly adoption event. We have 15 beautiful dogs and cats looking for their forever homes. Free health checks included!',
      location: 'Happy Tails Shelter',
      timestamp: '1 day ago',
      likes: 45,
      comments: 22,
      isLiked: false
    }
  ]);

  const toggleLike = (updateId: string) => {
    setUpdates(prev => 
      prev.map(update => 
        update.id === updateId 
          ? { 
              ...update, 
              isLiked: !update.isLiked,
              likes: update.isLiked ? update.likes - 1 : update.likes + 1
            }
          : update
      )
    );
  };

  const shareUpdate = (update: CommunityUpdate) => {
    toast({
      title: "Update Shared",
      description: `Shared "${update.title}" with your network.`,
    });
  };

  const getRoleColor = (role: string): "destructive" | "default" | "secondary" | "outline" | "success" | "warning" | "info" | "purple" => {
    switch (role) {
      case 'veterinarian': return 'success';
      case 'shelter': return 'info';
      case 'volunteer': return 'purple';
      case 'citizen': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rescue': return '🆘';
      case 'adoption': return '❤️';
      case 'update': return '📢';
      case 'alert': return '⚠️';
      case 'success': return '🎉';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string): "destructive" | "default" | "secondary" | "outline" | "success" | "warning" | "info" | "purple" => {
    switch (type) {
      case 'rescue': return 'warning';
      case 'adoption': return 'info';
      case 'update': return 'default';
      case 'alert': return 'destructive';
      case 'success': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Community Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={update.author.avatar} />
                  <AvatarFallback>{update.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{update.author.name}</h4>
                    <Badge variant={getRoleColor(update.author.role)} className="text-xs">
                      {update.author.role}
                    </Badge>
                    <Badge variant={getTypeColor(update.type)} className="text-xs">
                      {getTypeIcon(update.type)} {update.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{update.timestamp}</span>
                    </div>
                    {update.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{update.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">{update.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{update.content}</p>
                
                {update.hasImage && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Camera className="h-3 w-3" />
                    <span>Photo attached</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(update.id)}
                    className={`h-8 px-2 ${update.isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${update.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs">{update.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{update.comments}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareUpdate(update)}
                  className="h-8 px-2"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Load More Updates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityUpdates;
