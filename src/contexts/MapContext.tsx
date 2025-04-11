
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AnimalType = 'cat' | 'dog' | 'other';

export interface Animal {
  id: string;
  type: AnimalType;
  name: string;
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  status: 'needs_help' | 'being_helped' | 'adopted' | 'reported';
  reportedAt: string;
  reportedBy?: string;
}

interface MapContextType {
  animals: Animal[];
  filter: 'all' | 'cats' | 'dogs';
  selectedAnimal: Animal | null;
  mapboxToken: string | null;
  setMapboxToken: (token: string) => void;
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
  setFilter: React.Dispatch<React.SetStateAction<'all' | 'cats' | 'dogs'>>;
  setSelectedAnimal: React.Dispatch<React.SetStateAction<Animal | null>>;
  addAnimal: (animal: Omit<Animal, 'id' | 'reportedAt'>) => void;
  updateAnimalStatus: (id: string, status: Animal['status']) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

// Sample data
const initialAnimals: Animal[] = [
  {
    id: '1',
    type: 'cat',
    name: 'Whiskers',
    description: 'Orange tabby, very friendly, seems hungry',
    latitude: 51.507,
    longitude: -0.127,
    status: 'needs_help',
    reportedAt: new Date().toISOString(),
    reportedBy: 'Anonymous',
  },
  {
    id: '2',
    type: 'dog',
    name: 'Buddy',
    description: 'Brown mix breed, limping on back leg',
    latitude: 51.509,
    longitude: -0.118,
    status: 'being_helped',
    reportedAt: new Date().toISOString(),
    reportedBy: 'Jane Doe',
  },
  {
    id: '3',
    type: 'cat',
    name: 'Shadow',
    description: 'Black cat, shy but approachable',
    latitude: 51.513,
    longitude: -0.135,
    status: 'needs_help',
    reportedAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'dog',
    name: 'Max',
    description: 'Golden retriever, no collar, friendly',
    latitude: 51.505,
    longitude: -0.141,
    status: 'reported',
    reportedAt: new Date().toISOString()
  }
];

export const MapProvider = ({ children }: MapProviderProps) => {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
  const [filter, setFilter] = useState<'all' | 'cats' | 'dogs'>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  const addAnimal = (animal: Omit<Animal, 'id' | 'reportedAt'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString(),
      reportedAt: new Date().toISOString(),
    };
    
    setAnimals(prev => [...prev, newAnimal]);
  };

  const updateAnimalStatus = (id: string, status: Animal['status']) => {
    setAnimals(prev => 
      prev.map(animal => 
        animal.id === id ? { ...animal, status } : animal
      )
    );
    
    // Update selected animal if it's the one being updated
    if (selectedAnimal?.id === id) {
      setSelectedAnimal(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <MapContext.Provider
      value={{
        animals,
        filter,
        selectedAnimal,
        mapboxToken,
        setMapboxToken,
        setAnimals,
        setFilter,
        setSelectedAnimal,
        addAnimal,
        updateAnimalStatus
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
