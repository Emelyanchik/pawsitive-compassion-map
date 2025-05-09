
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';

interface QuickStatsBannerProps {
  needsHelpCount: number;
  totalCount: number;
}

const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({ needsHelpCount, totalCount }) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const hasCriticalAnimals = needsHelpCount > 0;
  
  if (!hasCriticalAnimals) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`z-10 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/30 
      flex items-center justify-between gap-2 text-sm`}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-300" />
        </div>
        <div>
          <span className="font-medium text-red-700 dark:text-red-300">
            {needsHelpCount} {needsHelpCount === 1 ? 'animal needs' : 'animals need'} urgent help
          </span>
          {!isMobile && (
            <span className="text-red-600/70 dark:text-red-400/70 ml-2">
              out of {totalCount} total reported animals
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-red-600/70 dark:text-red-400/70 whitespace-nowrap">
        Updated just now
      </div>
    </motion.div>
  );
};

export default QuickStatsBanner;
