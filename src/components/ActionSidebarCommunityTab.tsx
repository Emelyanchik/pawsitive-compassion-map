
import React from 'react';
import { Button } from './ui/button';
import { Users, Bell, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityUpdates from './CommunityUpdates';
import VolunteerScheduler from './VolunteerScheduler';
import AnimalCareReminders from './AnimalCareReminders';

interface ActionSidebarCommunityTabProps {
  onClose: () => void;
}

const ActionSidebarCommunityTab: React.FC<ActionSidebarCommunityTabProps> = ({ onClose }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community & Care
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <Tabs defaultValue="updates" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="updates">
            <Users className="h-4 w-4 mr-1" />
            Updates
          </TabsTrigger>
          <TabsTrigger value="volunteer">
            <Calendar className="h-4 w-4 mr-1" />
            Volunteer
          </TabsTrigger>
          <TabsTrigger value="reminders">
            <Bell className="h-4 w-4 mr-1" />
            Reminders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="updates" className="space-y-4">
          <CommunityUpdates />
        </TabsContent>
        
        <TabsContent value="volunteer" className="space-y-4">
          <VolunteerScheduler />
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4">
          <AnimalCareReminders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActionSidebarCommunityTab;
