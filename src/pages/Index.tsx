
import React from 'react';
import { MapProvider } from '@/contexts/MapContext';
import MapComponent from '@/components/MapComponent';
import Header from '@/components/Header';
import ActionSidebar from '@/components/ActionSidebar';

const Index = () => {
  return (
    <MapProvider>
      <div className="h-screen w-full overflow-hidden" style={{
        // Added CSS variables for pet map colors
        '--petmap-orange': '#FFA500',
        '--petmap-green': '#32CD32',
        '--petmap-purple': '#9B30FF',
        '--petmap-blue': '#0EA5E9'
      } as React.CSSProperties}>
        <Header />
        <div className="pt-14 h-full">
          <MapComponent />
        </div>
        <ActionSidebar />
      </div>
    </MapProvider>
  );
};

export default Index;
