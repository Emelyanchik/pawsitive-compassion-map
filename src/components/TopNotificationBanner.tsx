
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, Bell, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Announcement {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const TopNotificationBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate fetching an announcement
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        type: 'info',
        message: 'Welcome to PetMap! Help us map and rescue animals in need.',
        action: {
          label: 'Learn More',
          onClick: () => {
            // Open info dialog or redirect
            console.log('Learn more clicked');
          }
        }
      },
      {
        id: '2',
        type: 'warning',
        message: 'Increased stray animal activity reported in this area. Please be careful and report any sightings.',
        action: {
          label: 'Report',
          onClick: () => {
            // Open report form
            console.log('Report clicked');
          }
        }
      }
    ];

    // Select a random announcement
    const randomIndex = Math.floor(Math.random() * sampleAnnouncements.length);
    
    // Check if user has dismissed this announcement before
    const dismissedAnnouncements = localStorage.getItem('dismissedAnnouncements');
    const dismissed = dismissedAnnouncements ? JSON.parse(dismissedAnnouncements) : [];
    
    const selected = sampleAnnouncements[randomIndex];
    if (!dismissed.includes(selected.id)) {
      setTimeout(() => {
        setAnnouncement(selected);
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const dismissAnnouncement = () => {
    setIsVisible(false);
    
    // Store dismissal in localStorage
    const dismissedAnnouncements = localStorage.getItem('dismissedAnnouncements');
    const dismissed = dismissedAnnouncements ? JSON.parse(dismissedAnnouncements) : [];
    if (announcement) {
      dismissed.push(announcement.id);
      localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissed));
    }
    
    setTimeout(() => {
      setAnnouncement(null);
    }, 300);
  };

  const getIcon = () => {
    if (!announcement) return null;
    
    switch (announcement.type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (!announcement) return '';
    
    switch (announcement.type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30';
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30';
    }
  };

  if (!announcement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md ${getBgColor()} border-b`}
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {getIcon()}
              <p className="text-sm md:text-base">{announcement.message}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {announcement.action && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={announcement.action.onClick}
                  className="text-xs md:text-sm h-8"
                >
                  {announcement.action.label}
                </Button>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={dismissAnnouncement}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopNotificationBanner;
