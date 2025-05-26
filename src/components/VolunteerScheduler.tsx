
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Users, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'rescue' | 'transport' | 'feeding' | 'cleaning' | 'medical' | 'event';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
  time: string;
  duration: string;
  location: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  organizer: string;
  skills?: string[];
  isSignedUp?: boolean;
}

const VolunteerScheduler: React.FC = () => {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([
    {
      id: '1',
      title: 'Emergency Cat Rescue',
      description: 'Help rescue cats from an abandoned building. Experience with scared animals preferred.',
      type: 'rescue',
      urgency: 'urgent',
      date: '2024-01-21',
      time: '14:00',
      duration: '3 hours',
      location: 'Downtown District',
      volunteersNeeded: 4,
      volunteersSignedUp: 2,
      organizer: 'Animal Rescue Team',
      skills: ['Animal Handling', 'First Aid'],
      isSignedUp: false
    },
    {
      id: '2',
      title: 'Weekly Shelter Cleaning',
      description: 'Help clean kennels and prepare food for shelter animals. Great for new volunteers!',
      type: 'cleaning',
      urgency: 'medium',
      date: '2024-01-22',
      time: '09:00',
      duration: '4 hours',
      location: 'Happy Tails Shelter',
      volunteersNeeded: 8,
      volunteersSignedUp: 5,
      organizer: 'Happy Tails Shelter',
      isSignedUp: true
    },
    {
      id: '3',
      title: 'Pet Transport to Vet',
      description: 'Transport rescued animals to veterinary clinic for check-ups and treatments.',
      type: 'transport',
      urgency: 'high',
      date: '2024-01-23',
      time: '10:30',
      duration: '2 hours',
      location: 'Multiple locations',
      volunteersNeeded: 2,
      volunteersSignedUp: 0,
      organizer: 'Dr. Sarah Johnson',
      skills: ['Valid License', 'Vehicle'],
      isSignedUp: false
    }
  ]);

  const signUpForOpportunity = (opportunityId: string) => {
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === opportunityId
          ? {
              ...opp,
              isSignedUp: !opp.isSignedUp,
              volunteersSignedUp: opp.isSignedUp 
                ? opp.volunteersSignedUp - 1 
                : opp.volunteersSignedUp + 1
            }
          : opp
      )
    );

    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    if (opportunity) {
      toast({
        title: opportunity.isSignedUp ? "Removed from schedule" : "Signed up successfully!",
        description: opportunity.isSignedUp 
          ? `You've been removed from "${opportunity.title}"`
          : `You're now scheduled for "${opportunity.title}"`,
      });
    }
  };

  const getUrgencyColor = (urgency: string): "destructive" | "default" | "secondary" | "outline" | "success" | "warning" | "info" | "purple" => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rescue': return '🆘';
      case 'transport': return '🚗';
      case 'feeding': return '🍽️';
      case 'cleaning': return '🧹';
      case 'medical': return '🩺';
      case 'event': return '🎪';
      default: return '📝';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSpacesLeft = (opportunity: VolunteerOpportunity) => {
    return opportunity.volunteersNeeded - opportunity.volunteersSignedUp;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Volunteer Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.map((opportunity) => (
            <div 
              key={opportunity.id} 
              className={`p-4 rounded-lg border ${
                opportunity.isSignedUp 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(opportunity.type)}</span>
                  <h3 className="font-medium">{opportunity.title}</h3>
                  {opportunity.isSignedUp && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Badge variant={getUrgencyColor(opportunity.urgency)} className="text-xs">
                  {opportunity.urgency}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {opportunity.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(opportunity.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.time} ({opportunity.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.volunteersSignedUp}/{opportunity.volunteersNeeded} volunteers</span>
                </div>
              </div>

              {/* Skills Required */}
              {opportunity.skills && opportunity.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Skills needed:</p>
                  <div className="flex flex-wrap gap-1">
                    {opportunity.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Organized by {opportunity.organizer}</span>
                  {getSpacesLeft(opportunity) <= 2 && getSpacesLeft(opportunity) > 0 && (
                    <Badge variant="warning" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getSpacesLeft(opportunity)} spots left
                    </Badge>
                  )}
                  {getSpacesLeft(opportunity) === 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Full
                    </Badge>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant={opportunity.isSignedUp ? "outline" : "default"}
                  onClick={() => signUpForOpportunity(opportunity.id)}
                  disabled={!opportunity.isSignedUp && getSpacesLeft(opportunity) === 0}
                >
                  {opportunity.isSignedUp ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Sign Up
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              View All Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerScheduler;
