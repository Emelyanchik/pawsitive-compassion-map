
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimalDetails } from '@/components/AnimalDetails';
import { useMap } from '@/contexts/MapContext';

interface AnimalDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnimalDetailsDialog: React.FC<AnimalDetailsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { selectedAnimal } = useMap();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <AnimalDetails isInDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

export default AnimalDetailsDialog;
