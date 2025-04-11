
import React, { useState } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMap } from '@/contexts/MapContext';
import { Animal } from '@/contexts/MapContext';

interface SearchPanelProps {
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ onClose }) => {
  const { animals, setSelectedAnimal } = useMap();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'description'>('name');
  
  const filteredAnimals = animals.filter(animal => {
    if (!searchTerm) return false;
    
    const term = searchTerm.toLowerCase();
    if (searchType === 'name') {
      return animal.name.toLowerCase().includes(term);
    } else {
      return animal.description.toLowerCase().includes(term);
    }
  });
  
  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    onClose();
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
      
      <h2 className="text-xl font-bold mb-6 pr-8">Search Animals</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for animals..."
          className="pl-10"
        />
      </div>
      
      <RadioGroup value={searchType} onValueChange={(value: 'name' | 'description') => setSearchType(value)} className="mb-6">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="name" />
            <Label htmlFor="name">Name</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="description" id="description" />
            <Label htmlFor="description">Description</Label>
          </div>
        </div>
      </RadioGroup>
      
      {searchTerm ? (
        filteredAnimals.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-3">Found {filteredAnimals.length} results</p>
            {filteredAnimals.map(animal => (
              <div
                key={animal.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectAnimal(animal)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{animal.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{animal.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                        {animal.type}
                      </span>
                      <span className="text-xs capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                        {animal.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No animals found matching your search.</p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Start typing to search for animals.</p>
        </div>
      )}
    </div>
  );
};
