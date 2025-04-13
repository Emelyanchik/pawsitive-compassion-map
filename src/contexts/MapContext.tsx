
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  guardian?: string;
}

interface Guardian {
  name: string;
  telegramUsername?: string;
  animalsCount: number;
}

interface MapContextType {
  animals: Animal[];
  filter: 'all' | 'cats' | 'dogs';
  selectedAnimal: Animal | null;
  mapboxToken: string | null;
  userLocation: [number, number] | null;
  distanceFilter: number;
  setMapboxToken: (token: string) => void;
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
  setFilter: React.Dispatch<React.SetStateAction<'all' | 'cats' | 'dogs'>>;
  setSelectedAnimal: React.Dispatch<React.SetStateAction<Animal | null>>;
  setDistanceFilter: React.Dispatch<React.SetStateAction<number>>;
  addAnimal: (animal: Omit<Animal, 'id' | 'reportedAt'>) => void;
  updateAnimalStatus: (id: string, status: Animal['status']) => void;
  assignGuardian: (animalId: string, guardianName: string, telegramUsername?: string) => boolean;
  removeGuardian: (animalId: string) => void;
  guardians: Record<string, Guardian>;
  filteredAnimals: Animal[];
  statusFilter: string | null;
  setStatusFilter: React.Dispatch<React.SetStateAction<string | null>>;
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

// Helper function to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const MapProvider = ({ children }: MapProviderProps) => {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
  const [filter, setFilter] = useState<'all' | 'cats' | 'dogs'>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [guardians, setGuardians] = useState<Record<string, Guardian>>({});
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Filter animals based on type, distance, and status
  const filteredAnimals = animals.filter(animal => {
    // Filter by animal type
    if (filter !== 'all' && 
        ((filter === 'cats' && animal.type !== 'cat') || 
         (filter === 'dogs' && animal.type !== 'dog'))) {
      return false;
    }

    // Filter by status if statusFilter is set
    if (statusFilter && animal.status !== statusFilter) {
      return false;
    }

    // Filter by distance if userLocation is available
    if (userLocation && distanceFilter > 0) {
      const distance = calculateDistance(
        userLocation[1], userLocation[0], 
        animal.latitude, animal.longitude
      );
      return distance <= distanceFilter;
    }

    return true;
  });

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
    
    if (selectedAnimal?.id === id) {
      setSelectedAnimal(prev => prev ? { ...prev, status } : null);
    }
  };

  const assignGuardian = (animalId: string, guardianName: string, telegramUsername?: string): boolean => {
    const guardian = guardians[guardianName] || { name: guardianName, telegramUsername, animalsCount: 0 };
    
    if (guardian.animalsCount >= 5) {
      return false;
    }
    
    const updatedGuardian = {
      ...guardian,
      animalsCount: guardian.animalsCount + 1,
      telegramUsername: telegramUsername || guardian.telegramUsername
    };
    
    setGuardians(prev => ({
      ...prev,
      [guardianName]: updatedGuardian
    }));
    
    setAnimals(prev =>
      prev.map(animal =>
        animal.id === animalId ? { ...animal, guardian: guardianName } : animal
      )
    );
    
    if (selectedAnimal?.id === animalId) {
      setSelectedAnimal(prev => prev ? { ...prev, guardian: guardianName } : null);
    }
    
    return true;
  };

  const removeGuardian = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal || !animal.guardian) return;
    
    const guardianName = animal.guardian;
    const guardian = guardians[guardianName];
    
    if (guardian) {
      const updatedGuardian = {
        ...guardian,
        animalsCount: Math.max(0, guardian.animalsCount - 1)
      };
      
      setGuardians(prev => ({
        ...prev,
        [guardianName]: updatedGuardian
      }));
    }
    
    setAnimals(prev =>
      prev.map(animal =>
        animal.id === animalId ? { ...animal, guardian: undefined } : animal
      )
    );
    
    if (selectedAnimal?.id === animalId) {
      setSelectedAnimal(prev => prev ? { ...prev, guardian: undefined } : null);
    }
  };

  return (
    <MapContext.Provider
      value={{
        animals,
        filter,
        selectedAnimal,
        mapboxToken,
        userLocation,
        distanceFilter,
        setMapboxToken,
        setAnimals,
        setFilter,
        setSelectedAnimal,
        setDistanceFilter,
        addAnimal,
        updateAnimalStatus,
        assignGuardian,
        removeGuardian,
        guardians,
        filteredAnimals,
        statusFilter,
        setStatusFilter
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
