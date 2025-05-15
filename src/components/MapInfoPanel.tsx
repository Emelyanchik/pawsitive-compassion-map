
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Bookmark, Map, Info } from 'lucide-react';
import RecentMapActivity from '@/components/RecentMapActivity';
import MapBookmarks from '@/components/MapBookmarks';

const MapInfoPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  
  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Info</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-0">
          <RecentMapActivity />
        </TabsContent>
        
        <TabsContent value="bookmarks" className="mt-0">
          <MapBookmarks />
        </TabsContent>
        
        <TabsContent value="info" className="mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Map className="w-5 h-5" />
              Map Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">What is PetMap?</h4>
                <p className="text-sm text-gray-500">
                  PetMap helps communities locate, track, and help animals in need. 
                  Report animals that need assistance, volunteer to help, and earn tokens for your contributions.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Map Features</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• View animals that need help on the map</li>
                  <li>• Toggle between 2D and 3D view modes</li>
                  <li>• Use measurement tools to calculate distances</li>
                  <li>• Filter animals by type and status</li>
                  <li>• Save locations as bookmarks for quick access</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Status Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs">Needs Help</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs">Being Helped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-xs">Adopted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span className="text-xs">Reported</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-gray-500">
                  Click the Feedback button to report issues or suggest improvements.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapInfoPanel;
