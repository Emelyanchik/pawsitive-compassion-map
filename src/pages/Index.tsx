
import React from 'react';
import { MapProvider } from '@/contexts/MapContext';
import MapComponent from '@/components/MapComponent';
import Header from '@/components/Header';
import ActionSidebar from '@/components/ActionSidebar';

const Index = () => {
  return (
    <MapProvider>
      <div className="h-screen w-full overflow-hidden">
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
