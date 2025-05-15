
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to PetMap!",
    description: "PetMap helps you locate and assist animals in need in your area. Let's get you familiar with the key features.",
  },
  {
    title: "Reporting Animals",
    description: "Click anywhere on the map to report an animal in need. Fill in details about the animal to help others find and assist it.",
  },
  {
    title: "Animal Filters",
    description: "Use the filter options to find specific types of animals or those with particular needs.",
  },
  {
    title: "Map Tools",
    description: "Access helpful map tools like distance measurement, 3D view, and more using the buttons on the left side of the map.",
  },
  {
    title: "Volunteer & Earn Tokens",
    description: "Help animals in need and earn tokens that can be redeemed for rewards and discounts at partner pet stores.",
  },
];

interface WelcomeTourProps {
  onComplete: () => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('petmap-tour-completed', 'true');
    }
    setOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem('petmap-tour-completed', 'true');
    }
    setOpen(false);
    onComplete();
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const currentTourStep = tourSteps[currentStep];
  
  // Calculate progress percentage
  const progressPercent = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentTourStep.title}</DialogTitle>
          <DialogDescription>
            {currentTourStep.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentTourStep.image && (
          <div className="flex justify-center my-4">
            <img 
              src={currentTourStep.image} 
              alt={currentTourStep.title} 
              className="rounded-md max-h-60 object-contain"
            />
          </div>
        )}
        
        <div className="mt-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-center mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded text-primary h-4 w-4"
              />
              <span>Don't show again</span>
            </label>
            
            <div className="space-x-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                size="sm"
              >
                Skip
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button onClick={handleNext} size="sm">
                {isLastStep ? (
                  <>
                    <span>Finish</span>
                    <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeTour;
