
import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ReportPanelProps {
  onClose: () => void;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || !location || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate report submission
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "Thank you for your concern. Your report has been submitted.",
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
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
      
      <div className="flex items-center gap-2 mb-6 pr-8">
        <AlertTriangle className="h-5 w-5 text-petmap-orange" />
        <h2 className="text-xl font-bold">Report a Concern</h2>
      </div>
      
      <div className="bg-petmap-orange/10 p-4 rounded-lg mb-6">
        <p className="text-sm">
          Use this form to report animal welfare concerns, inaccurate information, or other issues.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportType">Type of Report</Label>
          <Select 
            value={reportType} 
            onValueChange={setReportType}
            required
          >
            <SelectTrigger id="reportType">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="animal_in_danger">Animal in Immediate Danger</SelectItem>
              <SelectItem value="abuse_neglect">Suspected Abuse or Neglect</SelectItem>
              <SelectItem value="injured_animal">Injured Animal</SelectItem>
              <SelectItem value="inaccurate_info">Inaccurate Information</SelectItem>
              <SelectItem value="other">Other Concern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Address or area description"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description of Concern</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about your concern"
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Information (Optional)</Label>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or phone number"
          />
          <p className="text-xs text-gray-500">
            Providing contact information helps us follow up if needed.
          </p>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          In case of emergency, please contact local animal control or emergency services directly.
        </p>
      </form>
    </div>
  );
};
