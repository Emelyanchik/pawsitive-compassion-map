
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface MapShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentView: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

const MapShareDialog: React.FC<MapShareDialogProps> = ({ open, onOpenChange, currentView }) => {
  const { toast } = useToast();
  const [includeViewSettings, setIncludeViewSettings] = useState(true);
  
  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const lat = currentView.center[1].toFixed(5);
    const lng = currentView.center[0].toFixed(5);
    
    let url = `${baseUrl}?lat=${lat}&lng=${lng}`;
    
    if (includeViewSettings) {
      url += `&zoom=${currentView.zoom.toFixed(1)}&pitch=${currentView.pitch.toFixed(0)}&bearing=${currentView.bearing.toFixed(0)}`;
    }
    
    return url;
  };
  
  const shareableLink = generateShareableLink();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Shareable link has been copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Could not copy link. Please try again.",
          variant: "destructive",
        });
      });
  };
  
  const shareMap = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PetMap Location',
          text: 'Check this location on PetMap!',
          url: shareableLink,
        });
        
        toast({
          title: "Map Shared",
          description: "The map view has been shared.",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing Failed",
            description: "Could not share map view. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Map View</DialogTitle>
          <DialogDescription>
            Share this exact map view with others.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="include-settings" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Include camera settings</span>
            </Label>
            <Switch
              id="include-settings"
              checked={includeViewSettings}
              onCheckedChange={setIncludeViewSettings}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Shareable Link
              </Label>
              <Input
                id="link"
                value={shareableLink}
                readOnly
                className="h-9"
              />
            </div>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Current coordinates: {currentView.center[1].toFixed(5)}, {currentView.center[0].toFixed(5)}</p>
            {includeViewSettings && (
              <p className="mt-1">
                Zoom: {currentView.zoom.toFixed(1)}, 
                Pitch: {currentView.pitch.toFixed(0)}°, 
                Bearing: {currentView.bearing.toFixed(0)}°
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button variant="default" onClick={shareMap} className="w-full sm:w-auto">
            <Share className="mr-2 h-4 w-4" />
            Share Map View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapShareDialog;
