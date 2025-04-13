import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '../contexts/MapContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Compass, MapPin, Plus, Minus, Dog, Cat } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AddAnimalForm } from './AddAnimalForm';
import AnimalDetailsDialog from './AnimalDetailsDialog';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const { 
    animals, 
    filter, 
    selectedAnimal, 
    setSelectedAnimal, 
    mapboxToken,
    setMapboxToken
  } = useMap();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapTokenInput, setMapTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [clickedLocation, setClickedLocation] = useState<[number, number] | null>(null);
  const [isAddAnimalDialogOpen, setIsAddAnimalDialogOpen] = useState(false);
  const [isAnimalDetailsOpen, setIsAnimalDetailsOpen] = useState(false);

  const setupMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [0, 51.5],
        zoom: 12,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setClickedLocation([lng, lat]);
        setIsAddAnimalDialogOpen(true);
      });

      map.current.on('load', () => {
        setIsMapReady(true);
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to initialize the map. Please check your Mapbox token.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation([-0.127, 51.507]);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapboxToken && userLocation && !map.current) {
      setupMap();
    }
  }, [mapboxToken, userLocation]);

  useEffect(() => {
    if (!isMapReady || !map.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const filteredAnimals = animals.filter(animal => {
      if (filter === 'all') return true;
      if (filter === 'cats') return animal.type === 'cat';
      if (filter === 'dogs') return animal.type === 'dog';
      return false;
    });

    filteredAnimals.forEach(animal => {
      const el = document.createElement('div');
      el.className = 'animal-marker';
      
      const statusColors = {
        needs_help: '#FF4500',
        being_helped: '#FFA500',
        adopted: '#32CD32',
        reported: '#9B30FF'
      };
      
      let iconSvg;
      if (animal.type === 'cat') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.25 3.75 1.17 5-.47 1.34-1.26 2.5-2.33 3.32A8.03 8.03 0 0 1 20 16c0 3.5-2.8 2.96-4 1.5-.63 1.47-1.4 3-3.5 3s-2.88-1.53-3.5-3C7.8 18.96 5 19.5 5 16c0-1.77.57-3.34 1.5-4.64-1.1-.83-1.9-2-2.38-3.36-.08-1.25-.24-4.42 1.17-5 1.39-.58 4.65.26 6.43 2.26.65-.17 1.33-.26 2-.26Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>`;
      } else if (animal.type === 'dog') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.305 2.344-2.628M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.398-2.344-2.628"/><path d="M8 14v.5M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path></svg>`;
      } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${statusColors[animal.status]}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      }
      
      el.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(iconSvg)}")`;
      el.style.width = '35px';
      el.style.height = '35px';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([animal.longitude, animal.latitude])
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setSelectedAnimal(animal);
        setIsAnimalDetailsOpen(true);
        map.current?.flyTo({
          center: [animal.longitude, animal.latitude],
          zoom: 15,
          duration: 1000
        });
      });

      markersRef.current[animal.id] = marker;
    });
  }, [animals, filter, isMapReady]);

  useEffect(() => {
    if (selectedAnimal && map.current) {
      map.current.flyTo({
        center: [selectedAnimal.longitude, selectedAnimal.latitude],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedAnimal]);

  const handleMapTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapTokenInput.trim()) {
      setMapboxToken(mapTokenInput.trim());
      localStorage.setItem('mapbox_token', mapTokenInput.trim());
    }
  };

  const handleUserLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 14,
        duration: 1000
      });
    }
  };

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const closeAddAnimalDialog = () => {
    setIsAddAnimalDialogOpen(false);
    setClickedLocation(null);
  };

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-background">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold text-center text-primary">MapBox API Token Required</h2>
          <p className="mb-4 text-sm text-gray-600">
            To use PetMap, you need to provide a Mapbox API token. Get your free token at{' '}
            <a 
              href="https://account.mapbox.com/auth/signup/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox.com
            </a>
          </p>
          <form onSubmit={handleMapTokenSubmit} className="space-y-4">
            <input
              type="text"
              value={mapTokenInput}
              onChange={(e) => setMapTokenInput(e.target.value)}
              placeholder="Enter your Mapbox token"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <Button type="submit" className="w-full">
              Continue to PetMap
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute left-4 bottom-20 flex flex-col space-y-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleZoomIn}
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleZoomOut}
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={handleUserLocation}
        >
          <Compass className="w-5 h-5 text-gray-700" />
        </Button>
      </div>

      <Dialog open={isAddAnimalDialogOpen} onOpenChange={setIsAddAnimalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Animal at Selected Location</DialogTitle>
            <DialogDescription>
              Report an animal at coordinates: {clickedLocation ? `${clickedLocation[1].toFixed(4)}, ${clickedLocation[0].toFixed(4)}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {clickedLocation && (
            <AddAnimalForm 
              initialValues={{
                latitude: clickedLocation[1],
                longitude: clickedLocation[0]
              }} 
              onSuccess={closeAddAnimalDialog}
              onCancel={closeAddAnimalDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AnimalDetailsDialog 
        open={isAnimalDetailsOpen} 
        onOpenChange={setIsAnimalDetailsOpen} 
      />
    </div>
  );
};

export default MapComponent;
