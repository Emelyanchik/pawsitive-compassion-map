
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  X, 
  Coins, 
  ArrowRight, 
  Info, 
  RefreshCw,
  BadgeCheck,
  Gift,
  Wallet
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TokenConversionPanelProps {
  onClose: () => void;
}

const rewardOptions = [
  { value: "donation", label: "Animal Shelter Donation", rate: 1, min: 100 },
  { value: "supplies", label: "Pet Supplies", rate: 0.5, min: 200 },
  { value: "certificate", label: "Volunteer Certificate", rate: 0.2, min: 500 },
  { value: "membership", label: "Premium Membership", rate: 0.1, min: 1000 },
];

export const TokenConversionPanel = ({ onClose }: TokenConversionPanelProps) => {
  const [amount, setAmount] = useState('100');
  const [rewardType, setRewardType] = useState(rewardOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const selectedReward = rewardOptions.find(r => r.value === rewardType) || rewardOptions[0];
  const rewardAmount = Math.floor(Number(amount) * selectedReward.rate);
  const isValid = Number(amount) >= selectedReward.min;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount required is ${selectedReward.min} tokens.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Conversion Successful",
        description: `You've converted ${amount} tokens to ${rewardAmount} ${selectedReward.label}.`,
      });
      setIsSubmitting(false);
      setAmount('100');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Coins className="mr-2 h-6 w-6 text-yellow-500" />
          Convert Tokens
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <span className="sr-only">Close</span>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Token Balance</CardTitle>
          <CardDescription>Tokens earned through volunteering</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Earned this month</p>
              <p className="text-lg font-medium">245</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Lifetime earned</p>
              <p className="text-lg font-medium">2,890</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="token-amount">Amount to Convert</Label>
            <div className="relative mt-1">
              <Input
                id="token-amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Coins className="h-4 w-4 text-gray-400" />
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the amount of tokens you want to convert</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {!isValid && (
              <p className="text-xs text-red-500 mt-1">
                Minimum required: {selectedReward.min} tokens
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="reward-type">Convert To</Label>
            <Select 
              value={rewardType} 
              onValueChange={setRewardType}
            >
              <SelectTrigger id="reward-type" className="w-full">
                <SelectValue placeholder="Select reward type" />
              </SelectTrigger>
              <SelectContent>
                {rewardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.rate}x rate)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">You Convert</p>
                  <p className="text-lg font-medium">{amount} Tokens</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">You Get</p>
                  <p className="text-lg font-medium">{rewardAmount} {selectedReward.label}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-xs text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>Conversion Rate</span>
                  <span>{selectedReward.rate}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Required</span>
                  <span>{selectedReward.min} tokens</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Processing..." : "Convert Tokens"}
          </Button>
        </div>
      </form>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="bg-white">
          <CardContent className="pt-6 px-3 text-center">
            <BadgeCheck className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm font-medium">Verified Rewards</h3>
            <p className="text-xs text-gray-500">All rewards are verified</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6 px-3 text-center">
            <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="text-sm font-medium">Special Offers</h3>
            <p className="text-xs text-gray-500">Exclusive rewards monthly</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6 px-3 text-center">
            <Wallet className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="text-sm font-medium">Secure System</h3>
            <p className="text-xs text-gray-500">Safe token management</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
