
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { HandHelping, MessageCircle, ExternalLink } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface VolunteerPanelProps {
  onClose: () => void;
}

export const VolunteerPanel = ({ onClose }: VolunteerPanelProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application Submitted",
        description: "Thank you for volunteering! We'll contact you soon.",
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  const openTelegramMiniApp = () => {
    window.open('https://t.me/petcare_game_bot', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Become a Volunteer</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <span className="sr-only">Close</span>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Join Our Mission</h3>
              <p className="text-white/80">Help animals in need in your community</p>
            </div>
            <HandHelping className="h-10 w-10" />
          </div>
          <p className="mb-4">As a volunteer, you can:</p>
          <ul className="list-disc list-inside space-y-1 mb-4 text-white/90">
            <li>Rescue and transport animals</li>
            <li>Foster pets temporarily</li>
            <li>Help with animal care</li>
            <li>Participate in community events</li>
            <li>Earn tokens for your contributions</li>
          </ul>
          <Button 
            className="w-full bg-white text-[#7E69AB] hover:bg-white/90"
            onClick={openTelegramMiniApp}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Try Our Telegram Pet Game
          </Button>
        </div>
        
        {/* Application form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium">Volunteer Application</h3>
          
          <div className="grid gap-3">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience and availability"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
        
        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Benefits</CardTitle>
            <CardDescription>Earn tokens and rewards for helping animals</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Earn 10 tokens for each hour volunteered</li>
              <li>Receive special badges for milestone achievements</li>
              <li>Get exclusive access to pet care resources</li>
              <li>Build a reputation in the pet care community</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => openPanel('token-holders')}>
              View Top Volunteers
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
