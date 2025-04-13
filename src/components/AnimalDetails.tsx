
import React, { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  X, 
  MapPin, 
  Calendar, 
  Heart, 
  DollarSign, 
  CheckCircle, 
  Share2, 
  MessageCircle, 
  PrinterIcon, 
  Bell, 
  Camera, 
  Bookmark, 
  Edit, 
  ArrowUpRight, 
  AlertTriangle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const AnimalDetails = () => {
  const { selectedAnimal, setSelectedAnimal, updateAnimalStatus } = useMap();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedAnimal) return null;

  const handleStatusUpdate = (status: 'needs_help' | 'being_helped' | 'adopted' | 'reported') => {
    updateAnimalStatus(selectedAnimal.id, status);
    toast({
      title: 'Status Updated',
      description: `${selectedAnimal.name}'s status has been updated.`,
    });
  };

  const handleSaveAnimal = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Removed from Saved' : 'Saved Successfully',
      description: isSaved 
        ? `${selectedAnimal.name} has been removed from your saved animals.` 
        : `${selectedAnimal.name} has been added to your saved animals.`,
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share Link Generated',
      description: 'A direct link to this animal has been copied to your clipboard.',
    });
  };

  const handlePrint = () => {
    toast({
      title: 'Preparing Print',
      description: 'Preparing a printable version of this animal profile.',
    });
  };

  const handleNotify = () => {
    toast({
      title: 'Notification Set',
      description: `You'll be notified about any updates regarding ${selectedAnimal.name}.`,
    });
  };

  const handleReportIssue = () => {
    toast({
      title: 'Report Submitted',
      description: 'Thank you for reporting an issue with this animal listing.',
    });
  };

  const handleContact = () => {
    toast({
      title: 'Contact Form',
      description: 'Opening contact form to reach out about this animal.',
    });
  };

  const handleDirections = () => {
    toast({
      title: 'Getting Directions',
      description: 'Opening directions to this animal location.',
    });
  };

  // Get status badge color
  const getStatusBadge = () => {
    switch (selectedAnimal.status) {
      case 'needs_help':
        return <Badge variant="destructive">Needs Help</Badge>;
      case 'being_helped':
        return <Badge className="bg-petmap-orange">Being Helped</Badge>;
      case 'adopted':
        return <Badge className="bg-petmap-green">Adopted</Badge>;
      case 'reported':
        return <Badge className="bg-petmap-purple">Reported</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="relative animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">{selectedAnimal.name}</h2>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleSaveAnimal}
            title={isSaved ? "Remove from saved" : "Save animal"}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setSelectedAnimal(null)}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {getStatusBadge()}
        <Badge variant="outline" className="capitalize">
          {selectedAnimal.type}
        </Badge>
        <Badge variant="outline" className="bg-gray-100">
          ID: {selectedAnimal.id.substring(0, 8)}
        </Badge>
      </div>
      
      {/* Action buttons row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleShare}
        >
          <Share2 className="h-3.5 w-3.5 mr-1" />
          Share
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleDirections}
        >
          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          Directions
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handlePrint}
        >
          <PrinterIcon className="h-3.5 w-3.5 mr-1" />
          Print
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Report
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              <h4 className="font-medium">Report an Issue</h4>
              <p className="text-xs text-gray-500">What's wrong with this listing?</p>
              <div className="grid gap-1">
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={handleReportIssue}>
                  Incorrect information
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={handleReportIssue}>
                  Animal not there
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={handleReportIssue}>
                  Duplicate listing
                </Button>
                <Button size="sm" variant="ghost" className="justify-start text-xs" onClick={handleReportIssue}>
                  Other concern
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Placeholder image */}
      <div className="bg-gray-100 w-full h-48 mb-4 rounded-md flex items-center justify-center text-gray-400 relative group">
        {selectedAnimal.type === 'cat' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.25 3.75 1.17 5-.47 1.34-1.26 2.5-2.33 3.32A8.03 8.03 0 0 1 20 16c0 3.5-2.8 2.96-4 1.5-.63 1.47-1.4 3-3.5 3s-2.88-1.53-3.5-3C7.8 18.96 5 19.5 5 16c0-1.77.57-3.34 1.5-4.64-1.1-.83-1.9-2-2.38-3.36-.08-1.25-.24-4.42 1.17-5 1.39-.58 4.65.26 6.43 2.26.65-.17 1.33-.26 2-.26Z" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.305 2.344-2.628M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.398-2.344-2.628" />
            <path d="M8 14v.5M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
          </svg>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm" className="h-8">
            <Camera className="h-4 w-4 mr-1" />
            Add Photos
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-1">Description</h3>
        <p className="text-gray-700 text-sm">{selectedAnimal.description}</p>
      </div>
      
      <div className="space-y-3 mb-6 bg-gray-50 p-3 rounded-md">
        <h3 className="text-sm font-medium">Location Details</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>Coordinates: {selectedAnimal.latitude.toFixed(4)}, {selectedAnimal.longitude.toFixed(4)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Reported {formatDistanceToNow(new Date(selectedAnimal.reportedAt))} ago</span>
        </div>
        
        {selectedAnimal.reportedBy && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="ml-6">By: {selectedAnimal.reportedBy}</span>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={handleContact}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Contact Reporter
        </Button>
      </div>
      
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium">Medical Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Condition:</span>
            <p>Unknown</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Injuries:</span>
            <p>Not specified</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Vaccination:</span>
            <p>Unknown</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500">Microchipped:</span>
            <p>Unknown</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium">Update Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleStatusUpdate('being_helped')}
            className="bg-petmap-orange hover:bg-petmap-orange/90"
            disabled={selectedAnimal.status === 'being_helped'}
          >
            <Heart className="h-4 w-4 mr-2" />
            Help Now
          </Button>
          
          <Button variant="outline" onClick={() => {
            toast({
              title: "Opening Donation Form",
              description: "You'll be able to donate to help this animal."
            });
          }}>
            <DollarSign className="h-4 w-4 mr-2" />
            Donate
          </Button>
          
          <Button 
            onClick={() => handleStatusUpdate('adopted')}
            className="bg-petmap-green hover:bg-petmap-green/90"
            disabled={selectedAnimal.status === 'adopted'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Adopted
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleStatusUpdate('needs_help')}
            disabled={selectedAnimal.status === 'needs_help'}
          >
            Mark Needs Help
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium">Additional Actions</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNotify}
            className="flex flex-col items-center justify-center h-auto py-2"
          >
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Notify Me</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "Edit Mode",
                description: "You can now edit this animal's information."
              });
            }}
            className="flex flex-col items-center justify-center h-auto py-2"
          >
            <Edit className="h-5 w-5 mb-1" />
            <span className="text-xs">Edit Info</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "View History",
                description: "Viewing this animal's status history."
              });
            }}
            className="flex flex-col items-center justify-center h-auto py-2"
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
