
import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import Header from '@/components/Header';
import ActionSidebar from '@/components/ActionSidebar';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  useEffect(() => {
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
    
    // Check if first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setWelcomeVisible(false);
    } else {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const dismissWelcome = () => {
    setWelcomeVisible(false);
  };

  return (
    <div className={`h-screen w-full overflow-hidden ${darkMode ? 'dark' : ''}`} style={{
      // Added CSS variables for pet map colors
      '--petmap-orange': '#FFA500',
      '--petmap-green': '#32CD32',
      '--petmap-purple': '#9B30FF',
      '--petmap-blue': '#0EA5E9'
    } as React.CSSProperties}>
      <Header />
      <div className="pt-14 h-full relative">
        <MapComponent />
        
        {/* Dark mode toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 z-10 rounded-full bg-white dark:bg-gray-800 shadow-md"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Welcome overlay for first-time users */}
      {welcomeVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to PetMap!</h2>
            <p className="mb-3">PetMap helps you locate and help animals in need around your area.</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Report animals that need help</li>
              <li>Volunteer to help animals</li>
              <li>Track animal status updates</li>
              <li>Earn tokens for your contributions</li>
            </ul>
            <Button onClick={dismissWelcome} className="w-full">Get Started</Button>
          </div>
        </div>
      )}
      
      <ActionSidebar />
    </div>
  );
};

export default Index;
