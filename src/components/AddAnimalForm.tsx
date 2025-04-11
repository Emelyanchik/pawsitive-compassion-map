
import React, { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, MapPin, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddAnimalFormProps {
  onClose: () => void;
}

export const AddAnimalForm: React.FC<AddAnimalFormProps> = ({ onClose }) => {
  const { addAnimal } = useMap();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<'cat' | 'dog' | 'other'>('cat');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'needs_help' | 'being_helped' | 'reported'>('needs_help');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [reportedBy, setReportedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current location
  const getCurrentLocation = () => {
    setIsSubmitting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsSubmitting(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please enter coordinates manually.",
            variant: "destructive",
          });
          setUseCurrentLocation(false);
          setIsSubmitting(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser. Please enter coordinates manually.",
        variant: "destructive",
      });
      setUseCurrentLocation(false);
      setIsSubmitting(false);
    }
  };

  // Get location on mount if using current location
  React.useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || (useCurrentLocation && (!latitude || !longitude))) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const numLatitude = typeof latitude === 'number' ? latitude : parseFloat(latitude);
    const numLongitude = typeof longitude === 'number' ? longitude : parseFloat(longitude);

    if (isNaN(numLatitude) || isNaN(numLongitude)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addAnimal({
        name,
        type,
        description,
        latitude: numLatitude,
        longitude: numLongitude,
        status,
        reportedBy: reportedBy || undefined,
      });

      toast({
        title: "Animal Added",
        description: `${name} has been added to the map.`,
      });

      onClose();
    } catch (error) {
      console.error("Error adding animal:", error);
      toast({
        title: "Error Adding Animal",
        description: "There was an error adding the animal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h2 className="text-xl font-bold mb-6 pr-8">Add Animal Sighting</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Animal Name or Identifier</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g., Brown Tabby, Limping Retriever"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Animal Type</Label>
          <Select value={type} onValueChange={(value: 'cat' | 'dog' | 'other') => setType(value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select animal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe the animal appearance, condition, behavior, etc."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <RadioGroup value={status} onValueChange={(value: 'needs_help' | 'being_helped' | 'reported') => setStatus(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="needs_help" id="needs_help" />
              <Label htmlFor="needs_help" className="cursor-pointer">Needs Help</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="being_helped" id="being_helped" />
              <Label htmlFor="being_helped" className="cursor-pointer">Being Helped</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reported" id="reported" />
              <Label htmlFor="reported" className="cursor-pointer">Just Reporting</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Location</Label>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="useCurrentLocation" 
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="useCurrentLocation" className="text-sm cursor-pointer">
                Use current location
              </Label>
            </div>
          </div>
          
          {useCurrentLocation ? (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              {latitude && longitude ? (
                <span>{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
              ) : (
                <span>Getting your location...</span>
              )}
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={isSubmitting}
                className="ml-auto"
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                <Input 
                  id="latitude" 
                  value={latitude} 
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || '')} 
                  placeholder="e.g., 51.507" 
                  required={!useCurrentLocation}
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                <Input 
                  id="longitude" 
                  value={longitude} 
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || '')}
                  placeholder="e.g., -0.127" 
                  required={!useCurrentLocation}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reportedBy">Your Name (Optional)</Label>
          <Input 
            id="reportedBy" 
            value={reportedBy} 
            onChange={(e) => setReportedBy(e.target.value)} 
            placeholder="Your name or 'Anonymous'"
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Animal
          </Button>
        </div>
      </form>
    </div>
  );
};
