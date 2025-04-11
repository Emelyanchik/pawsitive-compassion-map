
import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DonateFormProps {
  onClose: () => void;
}

export const DonateForm: React.FC<DonateFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('20');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate donation processing
    setTimeout(() => {
      toast({
        title: "Thank You for Your Donation!",
        description: `Your donation of $${amount === 'custom' ? customAmount : amount} will help animals in need.`,
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
        <DollarSign className="h-5 w-5 text-petmap-green" />
        <h2 className="text-xl font-bold">Make a Donation</h2>
      </div>
      
      <div className="bg-gradient-to-r from-petmap-purple/10 to-petmap-blue/10 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <Heart className="h-5 w-5 text-petmap-purple" />
          </div>
          <div>
            <h3 className="font-medium">Help Homeless Animals</h3>
            <p className="text-sm text-gray-600">
              Your donation helps provide food, shelter, and medical care to animals in need.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Select Donation Amount</Label>
          <RadioGroup 
            value={amount} 
            onValueChange={setAmount}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem 
                value="10" 
                id="amount-10" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="amount-10"
                className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                $10
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="20" 
                id="amount-20" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="amount-20"
                className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                $20
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="50" 
                id="amount-50" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="amount-50"
                className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                $50
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="100" 
                id="amount-100" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="amount-100"
                className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                $100
              </Label>
            </div>
            
            <div className="col-span-2">
              <RadioGroupItem 
                value="custom" 
                id="amount-custom" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="amount-custom"
                className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                Custom Amount
              </Label>
            </div>
          </RadioGroup>
          
          {amount === 'custom' && (
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-9"
                min="1"
                required={amount === 'custom'}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message of support"
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full gap-2 bg-petmap-green hover:bg-petmap-green/90"
          disabled={isSubmitting}
        >
          <CreditCard className="h-4 w-4" />
          {isSubmitting ? "Processing..." : `Donate $${amount === 'custom' ? (customAmount || '0') : amount}`}
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          This is a demo application. No actual payment will be processed.
        </p>
      </form>
    </div>
  );
};
